/* eslint-disable class-methods-use-this, max-classes-per-file */
import SchemaContext from './context'
import * as REGEX from './utils/regex'
import { Valid, Invalid, makeRule } from './utils/make_rule'
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
import { omit } from '../value'
import type { AnyObject, Full, MayBe, NonUndefined, Writable } from '../../_types'
import type { Message, EffectOptions, ValidateReturn, RuleOptions, Context } from './interface'

/** ========================================================================== */
/** ========================================================================== */
/** BaseSchema                                                                 */
/** ========================================================================== */
/** ========================================================================== */

export abstract class BaseSchema<Out = any, In = Out> {
  readonly _In!: In

  readonly _Out!: Out

  // 暂不提供同步校验方法
  async validate(value: any) {
    const context = SchemaContext.ensure()
    const ret = await this._validate(value, context)
    if (ret.status === 'valid') return ret.value
    throw context.issue
  }

  // 内部校验用同步方式
  _validate(value: Out, context: Context): ValidateReturn<Out> {
    let failure = false
    for (const { rule, message, params } of this.rules.values()) {
      if (rule(value)) continue
      failure = true
      context.issue.addIssue(message, context.path, params)
    }
    return failure ? Invalid : Valid(value)
  }

  // 规则
  private readonly rules = new Map<string | number, RuleOptions<Out>>()

  protected _refine(name: string | number, rule: RuleOptions<Out>) {
    this.rules.set(name, rule)
    return this
  }

  // 删除某一项规则
  protected remove(name: string | number) {
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
    rule: (value: Out, context: Context) => value is Next,
    message?: Message
  ): EffectSchema<this, Next>
  refine(
    rule: (value: Out, context: Context) => boolean | Promise<boolean>,
    message?: Message
  ): EffectSchema<this, Out>
  refine(
    rule: (value: Out, context: Context) => boolean | Promise<boolean>,
    message: Message = base.invalid
  ): EffectSchema<this, Out> {
    return EffectSchema.refinement(this, rule, message)
  }

  // 数据转换
  transform<Next>(
    handler: (value: Out, context: Omit<Context, 'issue'>) => Next | Promise<Next>
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

export class AnySchema<T = any> extends BaseSchema<T> {
  static create<T = any>() {
    return new AnySchema<T>()
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
    if (!isString(value)) {
      context.issue.addIssue(string.invalid, context.path)
      return Invalid
    }
    // 严格模式 且 为空字符串 认为是没有传
    if (this.strict && !value.length) {
      context.issue.addIssue(base.required, context.path)
      return Invalid
    }

    return super._validate(value, context)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  min(min: number, message: Message = string.min) {
    const rule = (value: string) => value.length >= min
    return this._refine('min', { rule, message, params: { min } })
  }

  max(max: number, message: Message = string.max) {
    const rule = (value: string) => value.length <= max
    return this._refine('max', { rule, message, params: { max } })
  }

  length(length: number, message: Message = string.length) {
    const rule = (value: string) => value.length === length
    return this._refine('length', { rule, message, params: { length } })
  }

  range(min: number, max: number, message: Message = string.range) {
    const rule = (value: string) => value.length >= min && value.length <= max
    return this._refine('range', { rule, message, params: { min, max } })
  }

  regex(regex: RegExp, message: Message = string.regex) {
    const rule = (value: string) => regex.test(value)
    return this._refine('regex', { rule, message, params: { regex } })
  }

  email(message: Message = string.email) {
    const rule = (value: string) => REGEX.email.test(value)
    return this._refine('email', { rule, message })
  }

  url(message: Message = string.url) {
    const rule = (value: string) => REGEX.url.test(value)
    return this._refine('url', { rule, message })
  }

  uuid(message: Message = string.uuid) {
    const rule = (value: string) => REGEX.uuid.test(value)
    return this._refine('uuid', { rule, message })
  }

  lowercase(message: Message = string.lowercase) {
    const rule = (value: string) => value === value.toLowerCase()
    return this._refine('lowercase', { rule, message })
  }

  uppercase(message: Message = string.uppercase) {
    const rule = (value: string) => value === value.toUpperCase()
    return this._refine('uppercase', { rule, message })
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
      context.issue.addIssue(number.invalid, context.path)
      return Invalid
    }
    return super._validate(value, context)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  min(min: number, message: Message = number.min) {
    const rule = (value: number) => value >= min
    return this._refine('min', { rule, message, params: { min } })
  }

  max(max: number, message: Message = number.max) {
    const rule = (value: number) => value <= max
    return this._refine('max', { rule, message, params: { max } })
  }

  equal(equal: number, message: Message = number.equal) {
    const rule = (value: number) => value === equal
    return this._refine('equal', { rule, message, params: { equal } })
  }

  range(min: number, max: number, message: Message = number.range) {
    const rule = (value: number) => value >= min && value <= max
    return this._refine('range', { rule, message, params: { min, max } })
  }

  positive(message: Message = number.positive) {
    const rule = (value: number) => value > 0
    return this._refine('positive', { rule, message })
  }

  negative(message: Message = number.negative) {
    const rule = (value: number) => value < 0
    return this._refine('negative', { rule, message })
  }

  integer(message: Message = number.integer) {
    return this._refine('integer', { rule: Number.isInteger, message })
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
    if (!isBoolean(value)) {
      context.issue.addIssue(boolean.invalid, context.path)
      return Invalid
    }
    return super._validate(value, context)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  true(message: Message = boolean.true) {
    const rule = (value: boolean) => value === true
    return this._refine('boolean', { rule, message })
  }

  // 二者也是互斥的，不能既是 true 又是 false 吧
  false(message: Message = boolean.false) {
    const rule = (value: boolean) => value === false
    return this._refine('boolean', { rule, message })
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
      context.issue.addIssue(date.invalid, context.path)
      return Invalid
    }
    return super._validate(value, context)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  min(min: Date, message: Message = date.min) {
    // TODO: 后续传值可以自行解析(是否需要呢？)
    const rule = (value: Date) => value >= min
    return this._refine('min', { rule, message, params: { min } })
  }

  max(max: Date, message: Message = date.max) {
    // TODO: 后续传值可以自行解析(是否需要呢？)
    const rule = (value: Date) => value <= max
    return this._refine('max', { rule, message, params: { max } })
  }
}

/** ========================================================================== */
/** ========================================================================== */
/** ArraySchema                                                                */
/** ========================================================================== */
/** ========================================================================== */

/** types ==================================================================== */

export type MakeInnerType<T extends any[]> = T extends Array<infer I>
  ? I extends BaseSchema
    ? I['_Out'][]
    : any[]
  : any[]

/** schema =================================================================== */

export class ArraySchema<T extends BaseSchema> extends BaseSchema<MakeInnerType<T[]>> {
  constructor(private readonly inner: T) {
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
      const ctx = SchemaContext.ensure(context, index)
      return this.inner._validate(item, ctx)
    })
    return Promise.all(list).then((results) => {
      for (const result of results) {
        if (result.status === 'invalid') return Invalid
      }
      // TODO: value 需要改变 因为内部可能会有 transform 改变了原始值
      return Valid(value)
    })
  }

  async _validate(value: MakeInnerType<T[]>, context: Context) {
    if (!isArray(value)) {
      context.issue.addIssue(array.invalid, context.path)
      return Invalid
    }

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
    return this._refine('min', { rule, message, params: { min } })
  }

  max(max: number, message: Message = array.min) {
    const rule = (value: any[]) => value.length <= max
    return this._refine('max', { rule, message, params: { max } })
  }

  length(length: number, message: Message = array.length) {
    const rule = (value: any[]) => value.length === length
    return this._refine('length', { rule, message, params: { length } })
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
    if (!this.inner.includes(value)) {
      context.issue.addIssue(enums.invalid, context.path, { enums: this.inner })
      return Invalid
    }
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

export class ObjectSchema<T extends ObjectShape, Out = MakePartial<T>> extends BaseSchema<Out> {
  constructor(public readonly inner: T) {
    super()
  }

  static create<S extends ObjectShape>(inner: S) {
    return new ObjectSchema<S>(inner as any)
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  async _validateInner(value: Out, context: Context) {
    // 是否要舍弃未指定的key?
    const list = Object.entries(this.shape).map(([key, schema]) => {
      const ctx = SchemaContext.ensure(context, key)
      return schema._validate(value[key], ctx)
    })
    return Promise.all(list).then((results) => {
      for (const result of results) {
        // 已经添加过 invalid 数据 此处直接返回即可
        if (result.status === 'invalid') return result
      }
      // TODO: value 需要改变 因为内部可能会有 transform 改变了原始值
      return Valid(value)
    })
  }

  async _validate(value: Out, context: Context) {
    if (!isObject(value)) {
      context.issue.addIssue(object.invalid, context.path)
      return Invalid
    }
    const ret = await super._validate(value, context)
    if (ret.status === 'invalid') return ret
    return this._validateInner(value, context)
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
/** UnionSchema                                                               */
/** ========================================================================== */
/** ========================================================================== */
// TODO: 是否要添加union呢?

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
    handler: (value: S['_Out'], context: Omit<Context, 'issue'>) => Next | Promise<Next>
  ) {
    return new EffectSchema(schema, { type: 'transform', handler })
  }

  // 不改变数据类型
  static refinement<S extends BaseSchema, Out = S['_Out']>(
    schema: S,
    rule: (value: Out, context: Context) => boolean | Promise<boolean>,
    message: Message
  ) {
    const handler = makeRule(rule, message)
    return new EffectSchema(schema, { type: 'refinement', handler })
  }

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

  async _validate(value: Out, context: Context) {
    const { options } = this
    if (options.type === 'transform') {
      // 先校验 后转换
      const ret = await this.schema._validate(value, context)
      if (ret.status === 'invalid') return ret
      const $value = await options.handler(value, omit(context, ['issue']))
      return Valid($value)
    }
    if (options.type === 'preprocess') {
      // 先转换 后校验
      const $value = await options.handler(value)
      return this.schema._validate($value, context)
    }

    // 先执行自身校验 后校验 handler
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

  _validate(value: Out | undefined, context: Context) {
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

  _validate(value: Out | null, context: Context) {
    if (isNull(value)) return Valid(value)
    return this.schema._validate(value, context)
  }

  unwrap() {
    return this.schema
  }
}

export const isRequiredSchema = (schema: BaseSchema | null | undefined = undefined) => {
  // 侦测是否含有 schema 字段 如果有则递归
  if (!schema) return false
  while (schema && (schema as any).schema) {
    if (schema instanceof OptionalSchema || schema instanceof NullableSchema) {
      return false
    }
    schema = (schema as any).schema
  }
  return true
}
