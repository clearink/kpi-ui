/* eslint-disable class-methods-use-this, max-classes-per-file */
// 后续有时间再优化吧 主要是针对错误信息的优化
import SchemaContext from './context'
import * as REGEX from './utils/regex'
import { Valid, Invalid, makeRule } from './utils/make_rule'
import { base, string, number, boolean, object, date, array, enums, union } from './locales/default'
import { omit } from '../value'
import {
  isArray,
  isBoolean,
  isDate,
  isObject,
  isNull,
  isNumber,
  isString,
  isUndefined,
  isNullish,
} from '../is'

import type { AnyObject, Full, MayBe, NonUndefined, Writable } from '../../types'
import type {
  Message,
  EffectOptions,
  ValidateReturn,
  MakeRuleReturn,
  Context,
  Options,
  InValidType,
  RuleReturn,
} from './interface'

/** ========================================================================== */
/** ========================================================================== */
/** BaseSchema                                                                 */
/** ========================================================================== */
/** ========================================================================== */

export abstract class BaseSchema<Out = any, In = Out> {
  readonly _In!: In

  readonly _Out!: Out

  // 暂不提供同步校验方法
  async validate(value: any, options?: Options) {
    const context = SchemaContext.ensure({ ...options, issue: undefined })
    const ret = await this._validate(value, context)
    if (ret.status === 'valid') return ret.value
    throw context.issue
  }

  // 内部校验
  _validate(value: Out, context: Context): ValidateReturn<Out> {
    const list = [...this.rules.values()].map((rule) => rule(value, context))
    return Promise.all(list).then((results) => {
      for (const result of results) {
        if (result.status === 'invalid') return result
      }
      return Valid(value)
    })
  }

  // 规则
  private readonly rules = new Map<string | number, MakeRuleReturn<Out>>()

  protected _refine(name: string | number, rule: MakeRuleReturn<any>) {
    this.rules.set(name, rule)
    return this
  }

  // 删除某一项规则
  protected _remove(name: string | number) {
    this.rules.delete(name)
    return this
  }

  /** ==================================================== */
  /** operator                                             */
  /** ==================================================== */

  required(message: Message = base.required): EffectSchema<this, NonNullable<Out>> {
    const rule = (value: any) => !isNullish(value)
    return EffectSchema.required(this, makeRule(rule, message)) as any
  }

  // 可以传 null
  nullable(): EffectSchema<this, Out | null> {
    return EffectSchema.nullable(this) as any
  }

  /** alias or */
  union<U extends BaseSchema>(schema: U): UnionSchema<[this, U]> {
    return UnionSchema.create([this, schema])
  }

  or<U extends BaseSchema>(schema: U): UnionSchema<[this, U]> {
    return UnionSchema.create([this, schema])
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
  transform<Next>(handler: (value: Out) => Next | Promise<Next>): EffectSchema<this, Next> {
    return EffectSchema.transform(this, handler) as any
  }

  // 数据预处理
  preprocess<Next>(handler: (value: any) => Next | Promise<Next>): EffectSchema<this, Next> {
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

  _validate(value: this['_Out']) {
    return Valid(value)
  }
}

/** ========================================================================== */
/** ========================================================================== */
/** StringSchema                                                               */
/** ========================================================================== */
/** ========================================================================== */

export class StringSchema extends BaseSchema<string | undefined> {
  static create(message: Message = string.invalid) {
    return new StringSchema(message)
  }

  constructor(private message: Message = string.invalid) {
    super()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  _validate(value: this['_Out'], context: Context) {
    if (isUndefined(value) || value === '') return Valid(value)

    if (!isString(value)) return Invalid(context)(this.message, { value })

    return super._validate(value, context)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  required(message: Message = base.required): EffectSchema<this, string> {
    const rule = (value: any) => !(isNullish(value) || value === '')
    return EffectSchema.required(this, makeRule(rule, message)) as any
  }

  min(min: number, message: Message = string.min) {
    const rule = (value: string) => value.length >= min
    return this._refine('min', makeRule(rule, message, { min }))
  }

  max(max: number, message: Message = string.max) {
    const rule = (value: string) => value.length <= max
    return this._refine('min', makeRule(rule, message, { max }))
  }

  length(length: number, message: Message = string.length) {
    const rule = (value: string) => value.length === length
    return this._refine('length', makeRule(rule, message, { length }))
  }

  range(min: number, max: number, message: Message = string.range) {
    const rule = (value: string) => value.length >= min && value.length <= max
    return this._refine('range', makeRule(rule, message, { min, max }))
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

export class NumberSchema extends BaseSchema<number | undefined> {
  static create(message: Message = number.invalid) {
    return new NumberSchema(message)
  }

  constructor(private message: Message = number.invalid) {
    super()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  _validate(value: this['_Out'], context: Context) {
    if (isUndefined(value)) return Valid(value)

    if (!isNumber(value) || Number.isNaN(value)) {
      return Invalid(context)(this.message, { value })
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
    const rule = (value: number) => Number.isInteger(value)
    return this._refine('integer', makeRule(rule, message))
  }
}

/** ========================================================================== */
/** ========================================================================== */
/** BooleanSchema                                                              */
/** ========================================================================== */
/** ========================================================================== */

export class BooleanSchema extends BaseSchema<boolean | undefined> {
  static create(message: Message = boolean.invalid) {
    return new BooleanSchema(message)
  }

  constructor(private message: Message = boolean.invalid) {
    super()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  _validate(value: this['_Out'], context: Context) {
    if (isUndefined(value)) return Valid(value)

    if (!isBoolean(value)) return Invalid(context)(this.message, { value })

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

export class DateSchema extends BaseSchema<Date | undefined> {
  static create(message: Message = date.invalid) {
    return new DateSchema(message)
  }

  constructor(private message: Message = date.invalid) {
    super()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */
  _validate(value: this['_Out'], context: Context) {
    if (isUndefined(value)) return Valid(value)

    if (!isDate(value) || Number.isNaN(value.getTime())) {
      return Invalid(context)(this.message, { value })
    }
    return super._validate(value, context)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  min(min: Date, message: Message = date.min) {
    const rule = (value: Date) => value >= min
    return this._refine('min', makeRule(rule, message, { min }))
  }

  max(max: Date, message: Message = date.max) {
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

export type MakeInnerType<T extends any[]> = T extends Array<infer I>
  ? I extends BaseSchema
    ? I['_Out'][]
    : any[]
  : any[]

/** schema =================================================================== */

export class ArraySchema<
  T extends BaseSchema,
  Out = MakeInnerType<T[]> | undefined
> extends BaseSchema<Out> {
  constructor(private readonly inner: T) {
    super()
  }

  static create<I extends BaseSchema>(inner?: I) {
    return new ArraySchema(inner ?? AnySchema.create())
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  async _validateInner(value: this['_Out'] & any[], context: Context) {
    const list = value.map((item, index) => {
      const ctx = SchemaContext.ensure(context, index)
      return this.inner._validate(item, ctx)
    })
    return Promise.all(list).then((results) => {
      for (const result of results) {
        if (result.status === 'invalid') return result
      }
      // TODO: value 需要改变 因为内部可能会有 transform 改变了原始值
      return Valid(value)
    })
  }

  async _validate(value: this['_Out'], context: Context) {
    if (isUndefined(value)) return Valid(value)

    if (!isArray(value)) return Invalid(context)(array.invalid, { value })

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

export class EnumSchema<T extends EnumInput> extends BaseSchema<T[number] | undefined> {
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

  _validate(value: this['_Out'], context: Context) {
    if (isUndefined(value)) return Valid(value)

    if (!this.inner.includes(value)) {
      return Invalid(context)(enums.invalid, { enums: this.inner, value })
    }
    return super._validate(value, context)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  get enum() {
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

export class ObjectSchema<
  T extends ObjectShape,
  Out = MakePartial<T> | undefined
> extends BaseSchema<Out> {
  constructor(public readonly inner: T) {
    super()
  }

  static create<S extends ObjectShape>(inner: S) {
    return new ObjectSchema<S>(inner as any)
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  async _validateInner(value: this['_Out'], context: Context) {
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

  async _validate(value: this['_Out'], context: Context) {
    if (isUndefined(value)) return Valid(value)

    if (!isObject(value)) return Invalid(context)(object.invalid, { value })

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

  // // TODO: 舍弃不存在的属性
  // strict(message: Message = object.unknown) {
  //   // const rule = (value: AnyObject) => true
  //   // 这个params要如何传进去呢? 只能在执行的时候通过context传递了
  //   return this
  // }

  // TODO: 保留不存在的属性
  passthrough() {
    this._remove('strict')
    return this
  }
}

/** ========================================================================== */
/** ========================================================================== */
/** UnionSchema                                                               */
/** ========================================================================== */
/** ========================================================================== */

/** types ==================================================================== */
export type UnionInput = readonly [BaseSchema, BaseSchema, ...BaseSchema[]]
export type UnionInnerReturn<T> = (readonly [Context, RuleReturn<T>])[]

/** schema =================================================================== */
export class UnionSchema<
  T extends UnionInput,
  Out = T[number]['_Out'] | undefined,
  In = T[number]['_In'] | undefined
> extends BaseSchema<Out, In> {
  static create<U extends UnionInput>(inner: U) {
    return new UnionSchema(inner)
  }

  constructor(private inner: T) {
    super()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  async _validate(value: this['_Out'], context: Context) {
    if (isUndefined(value)) return Valid(value)

    const results: UnionInnerReturn<Out> = await Promise.all(
      this.inner.map(async (schema) => {
        const ctx = SchemaContext.ensure(omit(context, ['issue']))
        try {
          return [ctx, await schema._validate(value, ctx)]
        } catch (error) {
          return [ctx, error as InValidType]
        }
      })
    )

    // 存在合法的就返回
    for (const [, result] of results) {
      if (result.status === 'valid') return result
    }

    // TODO: 需要手段检测是否为 invalid_type 错误
    for (const [, result] of results) {
      if (result.status === 'invalid') {
        // 存在不是 invalid_type 的错误
        return result
      }
    }

    // 如果 results 都是 invalid_type 就联合成一个 invalid_type
    // if(isAllInvalidType) return Invalid(xxx)

    // // TODO: 合并所有的错误信息,如何去除错误的类型判断呢?
    // const innerIssues = results.reduce((res, [ctx]) => {
    //   return res.concat(ctx.issue.issues)
    // }, [] as SchemaIssue[])

    // context.issue.issues.push(...innerIssues)
    return Invalid(context)(union.invalid, { value })
  }
}

/** ========================================================================== */
/** ========================================================================== */
/** EffectSchema                                                               */
/** ========================================================================== */
/** ========================================================================== */

export class EffectSchema<
  T extends BaseSchema<any>,
  Out = T['_Out'],
  In = T['_In']
> extends BaseSchema<Out, In> {
  // 数据转换 <NewOut>(value:Out) => NewOut | Promise<NewOut>
  // 可以改变数据类型
  static transform<S extends BaseSchema, Next = S['_Out']>(
    schema: S,
    handler: (value: S['_Out']) => Next | Promise<Next>
  ) {
    return new EffectSchema(schema, { type: 'transform', handler })
  }

  // 不改变数据类型
  static refinement<S extends BaseSchema, Out = S['_Out']>(
    schema: S,
    rule: (value: Out) => boolean | Promise<boolean>,
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

  // 必填
  static required<S extends BaseSchema>(
    schema: S,
    handler: (value: S['_Out'], context: Context) => Promise<RuleReturn<S['_Out']>>
  ) {
    return new EffectSchema(schema, { type: 'required', handler })
  }

  // 可传 null
  static nullable<S extends BaseSchema>(schema: S) {
    return new EffectSchema(schema, { type: 'nullable' })
  }

  get _type() {
    return this.options.type
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
      const $value = await options.handler(value)
      return Valid($value)
    }
    // 预处理
    if (options.type === 'preprocess') {
      // 先转换 后校验
      const $value = await options.handler(value)
      return this.schema._validate($value, context)
    }

    if (options.type === 'nullable') {
      if (isNull(value)) return Valid(value)
      return this.schema._validate(value, context)
    }

    if (options.type === 'required') {
      const ret = await options.handler(value, context)
      if (ret.status === 'invalid') return ret
      return this.schema._validate(value, context)
    }

    // 先执行自身校验 后校验 handler
    const ret = await this.schema._validate(value, context)
    if (ret.status === 'invalid') return ret
    return options.handler(value, context)
  }

  unwrap() {
    return this.schema
  }
}

export const isRequiredSchema = (schema: BaseSchema | null | undefined = undefined) => {
  // 侦测是否含有 schema 字段 如果有则递归
  if (!schema) return false

  while (schema && (schema as any).schema) {
    if (!(schema instanceof EffectSchema)) break

    const type = schema._type
    if (type === 'required') return true
    if (type === 'nullable') return false

    schema = (schema as any).schema
  }

  return false
}
