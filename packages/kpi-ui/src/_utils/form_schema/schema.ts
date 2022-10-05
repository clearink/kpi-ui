/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
import { MakeRuleReturn, Message, EffectOptions, Context, ValidateReturn } from './interface'
import { Valid, Invalid, makeRule } from './shared/make_rule'
import * as REGEX from './shared/regex'
import { base, string, number, boolean, object, date, array, enums } from './locales/default'
import {
  isArray,
  isBoolean,
  isDate,
  isObject,
  isNull,
  isNumber,
  isString,
  isUndefined,
} from '../is'
import { AnyObject, Full, MayBe, NonUndefined, Writable } from '../../_types'

/** ========================================================================== */
/** ========================================================================== */
/** BaseSchema                                                                 */
/** ========================================================================== */
/** ========================================================================== */

export abstract class BaseSchema<Out = any, In = Out> {
  readonly _In!: In

  readonly _Out!: Out

  // 校验自身 rules 规则
  // TODO: Context为可选项
  _validate(value: Out, context: Context): ValidateReturn<Out> {
    const list = [...this.rules.values()].map((rule) => {
      const ctx: Context = {
        path: [...context.path],
        branch: [...context.branch, value],
      }
      return rule(value, ctx)
    })
    return Promise.all(list).then((result) => {
      for (const res of result) {
        // TODO: 返回多个错误
        if (res.status === 'invalid') return res
      }
      return Valid(value)
    })
  }

  async validate(value: any = undefined) {
    const ctx = { path: [], branch: [] }
    const ret = await this._validate(value, ctx)
    if (ret.status === 'valid') return ret.value
    return Promise.reject(ret)
  }

  // TODO: 获取 context
  private getContext(ctx?: Context) {
    return ctx ?? { path: [], branch: [] }
  }

  // 规则
  private readonly rules = new Map<string | number, MakeRuleReturn<Out>>()

  _refine(name: string | number, rule: MakeRuleReturn) {
    this.rules.set(name, rule)
    return this
  }

  // 删除某一项规则
  remove(name: string | number) {
    this.rules.delete(name)
    return this
  }

  /** ==================================================== */
  /** operator                                             */
  /** ==================================================== */

  // 可以传 undefined
  optional(): OptionalSchema<this> {
    return OptionalSchema.create(this) as any
  }

  // 可以传 null
  nullable(): NullableSchema<this> {
    return NullableSchema.create(this) as any
  }

  // 可以传 undefined, null
  nullish() {
    return this.optional().nullable()
  }

  // refine 自定义验证
  refine<Next extends Out>(
    rule: (value: Out) => value is Next,
    message?: Message
  ): EffectSchema<this, Next>
  refine(
    rule: (value: Out) => boolean | Promise<boolean>,
    message?: Message
  ): EffectSchema<this, Out>
  refine(
    rule: (value: Out) => boolean | Promise<boolean>,
    message: Message = base.invalid
  ): EffectSchema<this, Out> {
    return EffectSchema.refinement(this, rule, message)
  }

  // 数据转换
  transform<Next>(
    handler: (value: Out, context: any) => Next | Promise<Next>
  ): EffectSchema<this, Next> {
    return EffectSchema.transform(this, handler) as any
  }

  // 数据预处理
  preprocess<Next>(handler: (value: Out) => Next | Promise<Next>): EffectSchema<this, Next> {
    return EffectSchema.preprocess(this, handler)
  }
}

/** ========================================================================== */
/** ========================================================================== */
/** AnySchema                                                                  */
/** ========================================================================== */
/** ========================================================================== */

export class AnySchema extends BaseSchema {
  static create() {
    return new AnySchema()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  _validate(value: any) {
    return Valid(value)
  }
}

/** ========================================================================== */
/** ========================================================================== */
/** StringSchema                                                               */
/** ========================================================================== */
/** ========================================================================== */

export class StringSchema extends BaseSchema<string> {
  static create(strict = false) {
    return new StringSchema(strict)
  }

  constructor(private strict: boolean) {
    super()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  _validate(value: string, context: Context) {
    // TODO: 传入参数将确定是否允许空字符串 默认允许
    if (!isString(value)) return Invalid(value, string.invalid, context)
    // 严格模式 且 为空字符串 认为是没有传
    if (this.strict && !value.length) return Invalid(value, base.required, context)
    return super._validate(value, context)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  min(min: number, message: Message = string.min) {
    const rule = (value: string) => value.length >= min
    return this._refine('min', makeRule(rule, message, { min }))
  }

  max(max: number, message: Message = string.max) {
    const rule = (value: string) => value.length <= max
    return this._refine('max', makeRule(rule, message, { max }))
  }

  length(length: number, message: Message = string.length) {
    const rule = (value: string) => value.length === length
    return this._refine('length', makeRule(rule, message, { length }))
  }

  regex(regex: RegExp, message: Message = string.regex) {
    const rule = (value: string) => regex.test(value)
    return this._refine('regex', makeRule(rule, message, { regex }))
  }

  email(message: Message = string.email) {
    const rule = (value: string) => REGEX.email.test(value)
    return this._refine('email', makeRule(rule, message))
  }

  url(message: Message = string.url) {
    const rule = (value: string) => REGEX.url.test(value)
    return this._refine('url', makeRule(rule, message))
  }

  uuid(message: Message = string.uuid) {
    const rule = (value: string) => REGEX.uuid.test(value)
    return this._refine('uuid', makeRule(rule, message))
  }

  lowercase(message: Message = string.lowercase) {
    const rule = (value: string) => value === value.toLowerCase()
    return this._refine('lowercase', makeRule(rule, message))
  }

  uppercase(message: Message = string.uppercase) {
    const rule = (value: string) => value === value.toUpperCase()
    return this._refine('uppercase', makeRule(rule, message))
  }
}

/** ========================================================================== */
/** ========================================================================== */
/** NumberSchema                                                               */
/** ========================================================================== */
/** ========================================================================== */

export class NumberSchema extends BaseSchema<number> {
  static create() {
    return new NumberSchema()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  _validate(value: number, context: Context) {
    if (!isNumber(value) || Number.isNaN(value)) {
      return Invalid(value, number.invalid, context)
    }
    return super._validate(value, context)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  min(min: number, message: Message = number.min) {
    const rule = (value: number) => value >= min
    return this._refine('min', makeRule(rule, message, { min }))
  }

  max(max: number, message: Message = number.max) {
    const rule = (value: number) => value <= max
    return this._refine('max', makeRule(rule, message, { max }))
  }

  equal(equal: number, message: Message = number.equal) {
    const rule = (value: number) => value === equal
    return this._refine('equal', makeRule(rule, message, { equal }))
  }

  range(min: number, max: number, message: Message = number.range) {
    const rule = (value: number) => value >= min && value <= max
    return this._refine('range', makeRule(rule, message, { min, max }))
  }

  positive(message: Message = number.positive) {
    const rule = (value: number) => value > 0
    return this._refine('positive', makeRule(rule, message))
  }

  negative(message: Message = number.negative) {
    const rule = (value: number) => value < 0
    return this._refine('negative', makeRule(rule, message))
  }

  integer(message: Message = number.integer) {
    return this._refine('integer', makeRule(Number.isInteger, message))
  }
}

/** ========================================================================== */
/** ========================================================================== */
/** BooleanSchema                                                              */
/** ========================================================================== */
/** ========================================================================== */

export class BooleanSchema extends BaseSchema<boolean> {
  static create() {
    return new BooleanSchema()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  _validate(value: boolean, context: Context) {
    if (!isBoolean(value)) return Invalid(value, boolean.invalid, context)
    return super._validate(value, context)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  true(message: Message = boolean.true) {
    const rule = (value: boolean) => value === true
    return this._refine('boolean', makeRule(rule, message))
  }

  // 二者也是互斥的，不能既是 true 又是 false 吧
  false(message: Message = boolean.false) {
    const rule = (value: boolean) => value === false
    return this._refine('boolean', makeRule(rule, message))
  }
}

/** ========================================================================== */
/** ========================================================================== */
/** DateSchema                                                                 */
/** ========================================================================== */
/** ========================================================================== */

export class DateSchema extends BaseSchema<Date> {
  static create() {
    return new DateSchema()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */
  _validate(value: Date, context: Context) {
    if (!isDate(value) || Number.isNaN(value.getTime())) {
      return Invalid(value, date.invalid, context)
    }
    return super._validate(value, context)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  min(min: Date, message: Message = date.min) {
    // TODO: 后续传值可以自行解析(是否需要呢？)
    const rule = (value: Date) => value >= min
    return this._refine('min', makeRule(rule, message, { min }))
  }

  max(max: Date, message: Message = date.max) {
    // TODO: 后续传值可以自行解析(是否需要呢？)
    const rule = (value: Date) => value <= max
    return this._refine('max', makeRule(rule, message, { max }))
  }
}

/** ========================================================================== */
/** ========================================================================== */
/** ArraySchema                                                                */
/** ========================================================================== */
/** ========================================================================== */

/** types ==================================================================== */

export type ArrayInner<T> = T extends Array<infer I> ? I : never
export type MakeInnerType<T extends MayBe<any[]>> = T extends Array<infer I>
  ? I extends BaseSchema
    ? I['_Out'][]
    : T
  : T

/** schema =================================================================== */

export class ArraySchema<T extends BaseSchema> extends BaseSchema<MakeInnerType<T[]>, T[]> {
  constructor(private readonly inner: BaseSchema<ArrayInner<T[]>>) {
    super()
  }

  static create<I extends BaseSchema>(inner: I) {
    return new ArraySchema(inner)
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  async _validateInner(value: MakeInnerType<T[]>, context: Context) {
    const list = value.map((item, index) => {
      // TODO: 重新计算 context
      const ctx: Context = {
        path: [...context.path, index],
        branch: [...context.branch, item],
      }
      return this.inner._validate(item, ctx)
    })
    return Promise.all(list).then((results) => {
      for (const result of results) {
        // TODO: 组合多个错误
        if (result.status === 'invalid') return result as any
      }
      return Valid(value)
    })
  }

  async _validate(value: MakeInnerType<T[]>, context: Context) {
    if (!isArray(value)) return Invalid(value, array.invalid, context)
    const ret = await super._validate(value, context)
    if (ret.status === 'invalid') return ret
    return this._validateInner(value, context)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  get element() {
    return this.inner
  }

  min(min: number, message: Message = array.min) {
    const rule = (value: any[]) => value.length >= min
    return this._refine('min', makeRule(rule, message, { min }))
  }

  max(max: number, message: Message = array.min) {
    const rule = (value: any[]) => value.length <= max
    return this._refine('max', makeRule(rule, message, { max }))
  }

  length(length: number, message: Message = array.length) {
    const rule = (value: any[]) => value.length === length
    return this._refine('length', makeRule(rule, message, { length }))
  }

  nonempty(message: Message = array.nonempty) {
    return this.min(1, message)
  }
}

/** ========================================================================== */
/** ========================================================================== */
/** EnumSchema                                                                 */
/** ========================================================================== */
/** ========================================================================== */

/** types ==================================================================== */

export type EnumItem = string | number | symbol | boolean
export type EnumInput = Readonly<[EnumItem, ...EnumItem[]]>

/** schema =================================================================== */

export class EnumSchema<T extends EnumInput> extends BaseSchema<T[number], T> {
  constructor(private readonly inner: T) {
    super()
  }

  static create<U extends EnumItem, E extends Readonly<[U, ...U[]]>>(
    enums: E
  ): EnumSchema<Writable<E>>
  static create<U extends EnumItem, E extends [U, ...U[]]>(inner: E) {
    return new EnumSchema<E>(inner)
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  _validate(value: T[number], context: Context) {
    if (!this.inner.includes(value)) return Invalid(value, enums.invalid, context)
    return super._validate(value, context)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  private get enum() {
    return this.inner
  }
}

/** ========================================================================== */
/** ========================================================================== */
/** ObjectSchema                                                               */
/** ========================================================================== */
/** ========================================================================== */

/** types ==================================================================== */

export type ObjectShape = Record<string, BaseSchema>

export type OptionalKeys<T extends ObjectShape> = {
  [K in keyof T]: undefined extends T[K]['_In'] ? K : never
}[keyof T]

export type RequiredKeys<T extends ObjectShape> = Exclude<keyof T, OptionalKeys<T>>

export type GroupPartial<T extends ObjectShape> = {
  [P in OptionalKeys<T>]?: NonUndefined<T[P]['_Out']>
} & {
  [P in RequiredKeys<T>]: NonUndefined<T[P]['_Out']>
}

export type MakePartial<T extends MayBe<ObjectShape>> = T extends AnyObject
  ? Full<GroupPartial<T>>
  : T

/** schema =================================================================== */

export class ObjectSchema<T extends ObjectShape> extends BaseSchema<MakePartial<T>, T> {
  constructor(public readonly inner: T) {
    super()
  }

  static create<S extends ObjectShape = {}>(inner: S) {
    return new ObjectSchema<S>(inner as any)
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  async _validate(value: AnyObject, context: Context) {
    if (!isObject(value)) return Invalid(value, object.invalid, context)
    // TODO: 校验schema中的每一个
    const list = Object.entries(this.inner).map(([key, schema]) => {
      const ctx: Context = {
        path: [...context.path, key],
        branch: [...context.branch, value[key]],
      }
      return schema._validate(value[key], ctx)
    })
    const ret = await Promise.all(list).then((results) => {
      for (const result of results) {
        if (result.status === 'invalid') return result
      }
      return Valid(value)
    })
    if (ret.status === 'invalid') return ret
    return super._validate(value as any, context)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  get shape() {
    return this.inner
  }

  // TODO: 舍弃不存在的属性
  strict(message: Message = object.unknown) {
    const rule = (value: AnyObject) => true
    // 这个params要如何传进去呢? 只能在执行的时候通过context传递了
    // return this._refine('strict', makeRule(rule, message, { unknown: '13' }))
    return this
  }

  // TODO: 保留不存在的属性
  passthrough() {
    this.remove('strict')
    return this
  }
}

/** ========================================================================== */
/** ========================================================================== */
/** EffectSchema                                                               */
/** ========================================================================== */
/** ========================================================================== */

export class EffectSchema<T extends BaseSchema, Out = T['_Out'], In = T['_In']> extends BaseSchema<
  Out,
  In
> {
  // 数据转换 <NewOut>(value:Out) => NewOut | Promise<NewOut>
  // 可以改变数据类型
  static transform<S extends BaseSchema, Next = S['_Out']>(
    schema: S,
    handler: (value: S['_Out'], context: any) => Next | Promise<Next>
  ) {
    return new EffectSchema(schema, { type: 'transfrom', handler })
  }

  // 自定义校验 (value: Out) => boolean | Promise<boolean>
  // 不改变数据类型
  static refinement<S extends BaseSchema, Out = S['_Out']>(
    schema,
    rule: (value: Out) => boolean | Promise<boolean>,
    message: Message
  ) {
    const handler = makeRule(rule, message)
    return new EffectSchema(schema, { type: 'refinement', handler })
  }

  // 预处理 (value: unknow) => unknow
  // 改变后才进行校验
  static preprocess<S extends BaseSchema, Next = S['_Out']>(
    schema,
    handler: (value: S['_Out']) => Next | Promise<Next>
  ) {
    return new EffectSchema(schema, { type: 'preprocess', handler })
  }

  constructor(private schema: T, private options: EffectOptions<Out>) {
    super()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  async _validate(value: Out, context: any) {
    const { options } = this
    if (options.type === 'transfrom') {
      // 先校验 后转换
      const ret = await this.schema._validate(value, context)
      if (ret.status === 'invalid') return ret
      return Valid(await options.handler(ret.value, context))
    }
    if (options.type === 'preprocess') {
      // 先转换后校验
      const $value = await options.handler(value)
      return this.schema._validate($value, context)
    }

    // refinement 先执行自身的 后校验 handler
    const ret = await this.schema._validate(value, context)
    if (ret.status === 'invalid') return ret
    return options.handler(value, context)
  }
}

/** ========================================================================== */
/** ========================================================================== */
/** OptionalSchema                                                             */
/** ========================================================================== */
/** ========================================================================== */

export class OptionalSchema<
  T extends BaseSchema,
  Out = T['_Out'],
  In = T['_In']
> extends BaseSchema<Out | undefined, In | undefined> {
  static create<S extends BaseSchema>(schema: S) {
    return new OptionalSchema(schema)
  }

  constructor(private schema: T) {
    super()
  }

  _validate(value: Out | undefined, context: any) {
    if (isUndefined(value)) return Valid(value)
    return this.schema._validate(value, context)
  }

  unwrap() {
    return this.schema
  }
}

/** ========================================================================== */
/** ========================================================================== */
/** NullableSchema                                                             */
/** ========================================================================== */
/** ========================================================================== */

export class NullableSchema<
  T extends BaseSchema,
  Out = T['_Out'],
  In = T['_In']
> extends BaseSchema<Out | null, In | null> {
  static create<S extends BaseSchema>(schema: S) {
    return new NullableSchema(schema)
  }

  constructor(private schema: T) {
    super()
  }

  _validate(value: Out | null, context: any) {
    if (isNull(value)) return Valid(value)
    return this.schema._validate(value, context)
  }

  unwrap() {
    return this.schema
  }
}
