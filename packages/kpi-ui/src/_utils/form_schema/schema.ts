/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
import { MakeRuleReturn, Message, RuleHandler, TransformHandler, ValidateReturn } from './interface'
import { Invalid, makeRule, Valid } from './shared/make_rule'
import { base, string, number, boolean, object, date, array, enums } from './locales/default'
import { isNull, isNumber, isString, isUndefined } from '../is'
import { AnyObject, Full, MayBe, NonUndefined, Writable } from '../../_types'
import { isArray, isBoolean, isDate, isObject } from '..'

/** ========================================================================== */
/** ========================================================================== */
/** BaseSchema                                                                 */
/** ========================================================================== */
/** ========================================================================== */

export abstract class BaseSchema<Out = any, In = Out> {
  readonly _In!: In

  readonly _Out!: Out

  // 校验类型
  _validate(value: Out, context: any): ValidateReturn<this['_Out']> {
    for (const rule of this.rules.values()) {
      const ret = rule(value, context)
      if (ret.status === 'invalid') return ret
    }
    return Valid(value)
  }

  // 获取 context 从而传递给 _validate
  async validate(value: any = undefined) {
    const ret = await this._validate(value, this.context)
    if (ret.status === 'invalid') {
      return Promise.reject(ret)
    }
    return ret
  }

  // 获取 context
  private get context() {
    return this
  }

  // 规则
  private readonly rules = new Map<string | number, MakeRuleReturn>()

  protected _refine(name: string | number, rule: MakeRuleReturn) {
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
    return OptionalSchema.create(this)
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
  ): EffectSchema<this, Next, In>
  refine(
    rule: (value: Out) => unknown | Promise<unknown>,
    message?: Message
  ): EffectSchema<this, Out, In>
  refine(
    rule: (value: Out) => unknown | Promise<unknown>,
    message: Message = base.invalid
  ): EffectSchema<this, Out, In> {
    const $rule = makeRule(rule as RuleHandler, message) as any
    return EffectSchema.refinement(this, $rule)
  }

  transform<NewOut>(handler: TransformHandler<Out, NewOut>): EffectSchema<this, NewOut> {
    return EffectSchema.transform(this, handler) as any
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

  _validate(value: any): ValidateReturn<this['_Out']> {
    return Valid(value)
  }
}

/** ========================================================================== */
/** ========================================================================== */
/** StringSchema                                                               */
/** ========================================================================== */
/** ========================================================================== */

export class StringSchema extends BaseSchema<string> {
  static create() {
    return new StringSchema()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */
  isType(value: MayBe<string>) {
    return isString(value)
  }

  _validate(value: string, context: any) {
    if (!isString(value)) return Invalid(value, string.invalid)
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
    // TODO: 待复制
    const regex = /email/
    const rule = (value: string) => regex.test(value)
    return this._refine('email', makeRule(rule, message))
  }

  url(message: Message = string.url) {
    // TODO: 待复制
    const regex = /url/
    const rule = (value: string) => regex.test(value)
    return this._refine('url', makeRule(rule, message))
  }

  uuid(message: Message = string.uuid) {
    const regex = /uuid/
    const rule = (value: string) => regex.test(value)
    return this._refine('uuid', makeRule(rule, message))
  }

  trim(message: Message = string.trim) {
    // TODO: 使用 EffectSchema
    // const handler = (value: MayBe<string>) => (isNullish(value) ? value : value.trim())
    // // 避免别的 transform 改变后造成 trimHandler 失效
    // const rule = (value: string) => value === value.trim()
    // return this.transform(handler)._refine('trim', makeRule(rule, message))
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

  _validate(value: number, context: any) {
    if (!isNumber(value) || Number.isNaN(value)) {
      return Invalid(value, number.invalid)
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
  isType(value: MayBe<boolean>) {
    return isBoolean(value)
  }

  _validate(value: boolean, context: any) {
    if (!isBoolean(value)) return Invalid(value, boolean.invalid)
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
  _validate(value: Date, context: any) {
    if (!isDate(value) || Number.isNaN(value.getTime())) {
      return Invalid(value, date.invalid)
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
  constructor(private readonly innerType: BaseSchema<ArrayInner<T[]>>) {
    super()
  }

  static create<I extends BaseSchema>(innerType: I) {
    return new ArraySchema(innerType)
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  _validate(value: MakeInnerType<T[]>, context: any) {
    if (!isArray(value)) return Invalid(value, array.invalid)
    // TODO: 校验每项类型
    return super._validate(value, context)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  get element() {
    return this.innerType
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

  _validate(value: T[number], context: any) {
    if (!this.inner.includes(value)) return Invalid(value, enums.invalid)
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
  constructor(public readonly schema: T) {
    // 校验一下 schema
    super()
  }

  static create<S extends ObjectShape = {}>(schema: S) {
    return new ObjectSchema<S>(schema as any)
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  _validate(value: AnyObject, context: any) {
    if (!isObject(value)) return Invalid(value, object.invalid)
    // TODO: 校验schema中的每一个
    Object.entries(value)
    return super._validate(value as any, context)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  get shape() {
    return this.schema
  }

  strict(message: Message = object.unknown) {
    const rule = (value: AnyObject) => true
    // 这个params要如何传进去呢? 只能在执行的时候通过context传递了
    return this._refine('strict', makeRule(rule, message, { unknown: '13' }))
  }

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
  // 数据转换
  static transform<S extends BaseSchema, NewOut = S['_Out']>(
    schema: S,
    handler: TransformHandler<S['_Out'], NewOut>
  ) {
    return new EffectSchema(schema, handler, 'transform')
  }

  // 自定义校验
  static refinement<S extends BaseSchema>(schema, handler: TransformHandler<S['_Out']>) {
    return new EffectSchema(schema, handler, 'refinement')
  }

  // 预处理
  static preprocess<S extends BaseSchema>(schema, handler: TransformHandler<S['_Out']>) {
    return new EffectSchema(schema, handler, 'preprocess')
  }

  handler: any = () => {}

  constructor(
    private schema: T,
    // TODO: 类型改变下
    handler: TransformHandler<Out>,
    private type: 'transform' | 'refinement' | 'preprocess'
  ) {
    super()
    this.handler = handler as any
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  async _validate(value: T['_Out'], context: any) {
    if (this.type === 'transform') {
      // 先校验 后转换
      const ret = await this.schema._validate(value, context)
      return this.handler(ret.value, context)
    }
    if (this.type === 'preprocess') {
      // 先转换后校验
      const $value = await this.handler(value, context)
      return this.schema._validate($value, context)
    }

    // TODO: 待完善
    // refinement 先校验handler 后执行自身的
    const ret = await this.handler(value, context)
    if (ret.status === 'invalid') return Invalid(ret.value, '')
    return this.schema._validate(value, context)
  }
}

/** ========================================================================== */
/** ========================================================================== */
/** OptionalSchema                                                             */
/** ========================================================================== */
/** ========================================================================== */

export class OptionalSchema<T extends BaseSchema> extends BaseSchema<
  T['_Out'] | undefined,
  T['_In'] | undefined
> {
  static create<S extends BaseSchema>(schema: S) {
    return new OptionalSchema(schema)
  }

  constructor(private schema: T) {
    super()
  }

  async _validate(value: MayBe<undefined>, context: any) {
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

export class NullableSchema<T extends BaseSchema> extends BaseSchema<
  T['_Out'] | null,
  T['_In'] | null
> {
  static create<S extends BaseSchema>(schema: S) {
    return new NullableSchema(schema)
  }

  constructor(private schema: T) {
    super()
  }

  _validate(value: MayBe<null>, context: any) {
    if (isNull(value)) return Valid(value)
    return this.schema._validate(value, context)
  }

  unwrap() {
    return this.schema
  }
}
