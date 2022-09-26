/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { AnyObject, Full, MayBe, NonUndefined, Writable } from './types'
import { Invalid, Valid, ValidateResult, Message, RuleHandler, makeRule } from './utils'
import {
  isArray,
  isBoolean,
  isDate,
  isNull,
  isNumber,
  isObject,
  isString,
  isUndefined,
} from '../validate_type'

/** ========================================================================== */
/** ========================================================================== */
/** BaseSchema                                                                 */
/** ========================================================================== */
/** ========================================================================== */

/** types ==================================================================== */
export type ValidateInput<T extends any = any> = {
  value: T
  context: BaseSchema | null
  path: ValidateInput[]
}

/** schema ==================================================================== */
export abstract class BaseSchema<Out = any, In = Out> {
  readonly _In!: In

  readonly _Out!: Out

  // 条件
  protected readonly conditions: any[] = []

  // 规则
  protected readonly rules: any[] = []

  // 内部校验
  abstract _validate(input: ValidateInput): ValidateResult<this['_Out']>

  // 数据校验
  public test(handler: RuleHandler, message?: Message) {
    this.rules.push(makeRule<In>(handler, message))
    return this
  }

  // 获取 context 从而传递给 _validate
  public async validate(value: any) {
    const input: ValidateInput = {
      value,
      context: this.getContext(),
      path: [],
    }
    const result = await this._validate(input)
    if (result.status === 'valid') {
      return result.value
    }
    return result.status
  }

  // 获取 context
  protected getContext() {
    return this
  }

  /** ==================================================== */
  /** operator                                             */
  /** ==================================================== */

  // 可以传 undefined
  public optional(): OptionalSchema<this> {
    return OptionalSchema.create(this)
  }

  // 可以传 null
  public nullable(): NullableSchema<this> {
    return NullableSchema.create(this)
  }

  // 可以传 null undefined
  public nullish() {
    return this.optional().nullable()
  }

  // and
  public and<S extends BaseSchema>(schema: S): IntersectionSchema<[this, S]> {
    return IntersectionSchema.create([this, schema])
  }

  // or
  public or<S extends BaseSchema>(schema: S): UnionSchema<[this, S]> {
    return UnionSchema.create([this, schema])
  }

  // transform 还不确定是否需要
  public transform<NewOut extends any>(transformer: (current: Out) => NewOut | Promise<NewOut>) {
    return EffectSchema.create()
  }

  // refine 自定义验证
  public refine(refinement) {
    return EffectSchema.create()
  }
}

/** ========================================================================== */
/** ========================================================================== */
/** AnySchema                                                                  */
/** ========================================================================== */
/** ========================================================================== */

export class AnySchema extends BaseSchema<any> {
  static create() {
    return new AnySchema()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */
  public _validate(input: ValidateInput) {
    return Valid(input.value)
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
  private isType(value: any) {
    // NaN 视为错误
    return isNumber(value) && !Number.isNaN(value)
  }

  public _validate(input: ValidateInput) {
    if (!this.isType(input.value)) return Invalid
    // for (const rule of this.rules) {
    //   // eslint-disable-next-line no-await-in-loop
    //   const result = await rule(input, {})
    //   if (result === false) {
    //   }
    // }
    return Valid(input.value)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  min(num: number, message?: Message) {
    return this.test((value: number) => value >= num, message)
  }

  max(num: number, message?: Message) {
    return this.test((value: number) => value <= num, message)
  }

  range(min: number, max: number, message?: Message) {
    return this.min(min, message).max(max, message)
  }

  equal(num: number, message?: Message) {
    return this.test((value: number) => value === num, message)
  }

  positive(message?: Message) {
    return this.test((value: number) => value > 0, message)
  }

  negative(message?: Message) {
    return this.test((value: number) => value < 0, message)
  }

  integer(message?: Message) {
    return this.test((value: number) => Number.isInteger(value), message)
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
  protected isType = isString

  public _validate(input: ValidateInput) {
    if (!this.isType(input)) return Invalid
    return Valid(input.value)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  min(len: number, message?: Message) {
    return this.test((value) => value.length >= len, message)
  }

  max(len: number, message?: Message) {
    return this.test((value) => value.length <= len, message)
  }

  length(len: number, message?: Message) {
    return this.test((value) => value.length === len, message)
  }

  // TODO
  email(message?: Message) {
    return this.test((value) => /email/.test(value), message)
  }

  // TODO
  uuid(message?: Message) {
    return this.test((value) => /uuid/.test(value), message)
  }
}

/** ========================================================================== */
/** ========================================================================== */
/** BooleanSchema                                                                  */
/** ========================================================================== */
/** ========================================================================== */

export class BooleanSchema extends BaseSchema<boolean> {
  static create() {
    return new BooleanSchema()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */
  protected isType = isBoolean

  public _validate(input: ValidateInput) {
    if (!this.isType(input)) return Invalid
    return Valid(input.value)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */
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
  protected isType = (input: ValidateInput) => {
    return isDate(input.value) && !Number.isNaN(input.value?.getTime())
  }

  public _validate(input: ValidateInput) {
    if (!this.isType(input)) return Invalid
    return Valid(input.value)
  }
  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  min(len: number, message?: Message) {
    return this.test((value) => value.length >= len, message)
  }

  max(len: number, message?: Message) {
    return this.test((value) => value.length <= len, message)
  }

  length(len: number, message?: Message) {
    return this.test((value) => value.length === len, message)
  }

  // TODO
  email(email: string, message?: Message) {
    return this.test((value) => /some/.test(value), message)
  }

  // TODO
  uuid(email: string, message?: Message) {
    return this.test((value) => /uuid/.test(value), message)
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

/** schema ==================================================================== */

export class ObjectSchema<T extends ObjectShape> extends BaseSchema<MakePartial<T>, T> {
  constructor(public readonly innerType: T) {
    super()
  }

  static create<S extends ObjectShape = {}>(innerType: S) {
    return new ObjectSchema<S>(innerType as any)
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  protected isType = (input: ValidateInput) => {
    return isObject(input.value)
  }

  public _validate(input: ValidateInput) {
    if (!this.isType(input)) return Invalid
    return Valid(input.value)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  private get shape() {
    return this.innerType
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

export class ArraySchema<T extends any> extends BaseSchema<MakeInnerType<T[]>, T[]> {
  constructor(private readonly innerType: BaseSchema<ArrayInner<T[]>>) {
    super()
  }

  static create<I extends BaseSchema>(innerType: I) {
    return new ArraySchema(innerType)
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */
  protected isType = (input: ValidateInput) => {
    return isArray(input.value)
  }

  public _validate(input: ValidateInput) {
    if (!this.isType(input)) return Invalid
    return Valid(input.value)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */
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
  constructor(private readonly innerType: T) {
    super()
  }

  static create<U extends EnumItem, E extends Readonly<[U, ...U[]]>>(
    enums: E
  ): EnumSchema<Writable<E>>
  static create<U extends EnumItem, E extends [U, ...U[]]>(enums: E) {
    return new EnumSchema<E>(enums)
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */
  protected isType = (input: ValidateInput) => {
    return this.innerType.includes(input.value)
  }

  public _validate(input: ValidateInput) {
    if (!this.isType(input)) return Invalid
    return Valid(input.value)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  private get enum() {
    return this.innerType
  }
}

/** ========================================================================== */
/** ========================================================================== */
/** OptionalSchema                                                             */
/** ========================================================================== */
/** ========================================================================== */

export class OptionalSchema<T extends BaseSchema> extends BaseSchema<T['_Out'] | undefined> {
  constructor(private readonly innerType: T) {
    super()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */
  protected isType = (input: ValidateInput) => {
    return isUndefined(input.value)
  }

  public _validate(input: ValidateInput) {
    if (this.isType(input)) return Valid(input.value)
    return this.innerType._validate(input)
  }

  public unwrap() {
    return this.innerType
  }

  static create<S extends BaseSchema>(innerSchema: S) {
    return new OptionalSchema(innerSchema)
  }
}

/** ========================================================================== */
/** ========================================================================== */
/** NullableSchema                                                             */
/** ========================================================================== */
/** ========================================================================== */

export class NullableSchema<T extends BaseSchema> extends BaseSchema<T['_Out'] | null> {
  constructor(private readonly innerType: T) {
    super()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */
  protected isType = (input: ValidateInput) => {
    return isNull(input.value)
  }

  public _validate(input: ValidateInput) {
    if (this.isType(input)) return Valid(input.value)
    return this.innerType._validate(input)
  }

  public unwrap() {
    return this.innerType
  }

  static create<S extends BaseSchema>(innerSchema: S) {
    return new NullableSchema(innerSchema)
  }
}

/** ========================================================================== */
/** ========================================================================== */
/** IntersectionSchema / AndSchema                                                         */
/** ========================================================================== */
/** ========================================================================== */

/** types ==================================================================== */

export type IntersectionInput = readonly [BaseSchema, BaseSchema, ...BaseSchema[]]
export type IntersectionOutput<T extends BaseSchema[]> = Full<
  T extends [infer I, ...infer RI]
    ? I extends BaseSchema
      ? I['_Out'] & (RI extends [BaseSchema, ...BaseSchema[]] ? IntersectionOutput<RI> : unknown)
      : never
    : never
>

/** schema ==================================================================== */

export class IntersectionSchema<T extends IntersectionInput> extends BaseSchema<
  IntersectionOutput<[...T]>,
  T
> {
  constructor(public readonly innerType: BaseSchema<ArrayInner<T>>) {
    super()
  }

  static create<U extends IntersectionInput = IntersectionInput>(inner: Readonly<U>) {
    return new IntersectionSchema<U>(inner as any)
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */
  protected isType = () => {
    // TODO: 待优化 或者不需要
    if (!Array.isArray(this.innerType)) return false
    return this.innerType.every((schema) => schema instanceof BaseSchema)
  }

  public _validate(input: ValidateInput) {
    if (!this.isType()) return Invalid
    return Valid(input.value)
  }
  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */
}

/** ========================================================================== */
/** ========================================================================== */
/** UnionSchema / OrSchema                                                                */
/** ========================================================================== */
/** ========================================================================== */

/** types ==================================================================== */

export type UnionInput = readonly [BaseSchema, BaseSchema, ...BaseSchema[]]
export type UnionOutput<T extends UnionInput> = T[number]['_Out']

/** schema =================================================================== */

export class UnionSchema<T extends UnionInput> extends BaseSchema<UnionOutput<T>, T> {
  constructor(public readonly innerType: UnionInput) {
    super()
  }

  static create<U extends UnionInput = UnionInput>(innerType: Readonly<U>) {
    return new UnionSchema<U>(innerType as any)
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  protected isType = () => {
    // TODO: 待优化 或者不需要
    if (!Array.isArray(this.innerType)) return false
    return this.innerType.every((schema) => schema instanceof BaseSchema)
  }

  public _validate(input: ValidateInput) {
    if (!this.isType()) return Invalid
    return Invalid
    // return Promise.all(this.innerType.map((schema) => schema._validate(input.value))).then(
    //   (results) => {
    //     for (const result of results) {
    //       if (result.status === 'valid') {
    //         return Valid(input.value)
    //       }
    //     }
    //     return Invalid
    //   }
    // )
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */
}

/** ========================================================================== */
/** ========================================================================== */
/** EffectSchema       TODO: 后续开发                                           */
/** ========================================================================== */
/** ========================================================================== */

// 数据校验后进行转换
export class EffectSchema<Out extends any, In extends any = Out> extends BaseSchema<Out, In> {
  public _validate(input: ValidateInput<any>) {
    return Invalid
  }

  static create() {
    return new EffectSchema()
  }
}
