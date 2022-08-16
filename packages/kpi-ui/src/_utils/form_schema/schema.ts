/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import {
  AnyObject,
  EffectType,
  FullType,
  MayBe,
  Message,
  NonUndefined,
  Rule,
  Writable,
} from './types'
import { InputValue, Invalid, toRawType, Valid, ValidateReturnType } from './utils'

/** ========================================================================== */
/** ========================================================================== */
/** BaseSchema                                                                 */
/** ========================================================================== */
/** ========================================================================== */

export abstract class BaseSchema<Out = any, In = Out> {
  readonly _In!: In

  readonly _Out!: Out

  // 条件
  private readonly conditions: any[] = []

  // 记录副作用
  private readonly effect: Set<EffectType> = new Set()

  // 记录数据转换函数， 在类型检查之前进行
  private readonly transforms: any[] = []

  private readonly rules: Rule[] = []

  abstract _validate(input: InputValue): ValidateReturnType<this['_Out']>

  // 检查副作用
  private _effectTest(input?: any, context?: any) {
    const { effect } = this

    if (!effect.has('nullable') && input === null) {
      throw new Error('filed not null')
    }
  }

  protected test(tester: Rule, message?: Message) {
    this.rules.push(makeRule<In>(tester, message))
    return this
  }

  public async validate(input: InputValue) {
    return this._validate(input)
  }

  /** =============================== */
  /** ========== Operator =========== */
  /** =============================== */

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
}

function makeRule<T extends any>(rule: Rule, message?: Message) {
  const $message = typeof message === 'object' ? message : { message }
  return async (input: T) => {
    const res = await rule(input)
    if (!res) throw new Error($message?.message || `invalid data : ${input}`)
    return res
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

  private isType(input: InputValue) {
    return toRawType(input.value) === 'undefined'
  }

  public _validate(input: InputValue): ValidateReturnType<this['_Out']> {
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
/** ObjectSchema                                                               */
/** ========================================================================== */
/** ========================================================================== */

/** types ==================================================================== */

export type ObjectShape = Record<string, BaseSchema>

export type OptionalKeys<T extends ObjectShape> = {
  [K in keyof T]: undefined extends T[K]['_In'] ? K : never
}[keyof T]

export type RequiredKeys<T extends ObjectShape> = Exclude<keyof T, OptionalKeys<T>>

export type FilterSchema<T extends ObjectShape> = FullType<{
  [K in keyof T]: T[K] extends BaseSchema ? T[K] : never
}>

export type GroupPartial<T extends ObjectShape> = {
  [P in OptionalKeys<T>]?: NonUndefined<T[P]['_Out']>
} & {
  [P in RequiredKeys<T>]: NonUndefined<T[P]['_Out']>
}

export type MakePartial<T extends MayBe<ObjectShape>> = T extends AnyObject
  ? FullType<GroupPartial<T>>
  : T

/** schema ==================================================================== */

export class ObjectSchema<T extends ObjectShape> extends BaseSchema<MakePartial<T>, T> {
  constructor(public readonly innerType: T) {
    super()
  }

  static create<S extends ObjectShape = {}>(innerType: S) {
    return new ObjectSchema<FilterSchema<S>>(innerType as any)
  }

  /** =============================== */
  /** ==========  Validate  ========= */
  /** =============================== */

  private isType(input: InputValue) {
    return toRawType(input.value) === 'object'
  }

  public _validate(input: InputValue): ValidateReturnType<this['_Out']> {
    if (!this.isType(input)) return Invalid
    return Valid(input.value)
  }

  /** =============================== */
  /** ==========  Feature  ========== */
  /** =============================== */

  private get shape() {
    return this.innerType
  }
}

/** ========================================================================== */
/** ========================================================================== */
/** IntersectionSchema                                                         */
/** ========================================================================== */
/** ========================================================================== */

/** types ==================================================================== */

export type IntersectionInput = readonly [BaseSchema, BaseSchema, ...BaseSchema[]]
export type IntersectionOutput<T extends BaseSchema[]> = FullType<
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

  /** =============================== */
  /** ==========  Validate  ========= */
  /** =============================== */
  private isType(input: InputValue) {
    return toRawType(input.value) === 'string'
  }

  public _validate(input: InputValue): ValidateReturnType<this['_Out']> {
    if (!this.isType(input)) return Invalid
    return Valid(input.value)
  }
  /** =============================== */
  /** ==========  Feature  ========== */
  /** =============================== */
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

  /** =============================== */
  /** ==========  Validate  ========= */
  /** =============================== */
  private isType(input: InputValue) {
    return toRawType(input.value) === 'string'
  }

  public _validate(input: InputValue): ValidateReturnType<this['_Out']> {
    if (!this.isType(input)) return Invalid
    return Valid(input.value)
  }

  /** =============================== */
  /** ==========  Feature  ========== */
  /** =============================== */
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

  private isType(input: InputValue) {
    return toRawType(input.value) === 'null'
  }

  public _validate(input: InputValue): ValidateReturnType<this['_Out']> {
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
/** UnionSchema                                                                */
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

  /** =============================== */
  /** ==========  Validate  ========= */
  /** =============================== */

  private isType() {
    if (!Array.isArray(this.innerType)) return false
    return this.innerType.every((schema) => schema instanceof BaseSchema)
  }

  public _validate(input: InputValue): ValidateReturnType<this['_Out']> {
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

  /** =============================== */
  /** ==========  Feature  ========== */
  /** =============================== */
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

  private isType() {
    return true
  }

  public _validate(input: InputValue): ValidateReturnType<this['_Out']> {
    return Valid(input.value)
  }
}

/** ========================================================================== */
/** ========================================================================== */
/** AnySchema                                                                  */
/** ========================================================================== */
/** ========================================================================== */

export class BooleanSchema extends BaseSchema<boolean> {
  static create() {
    return new BooleanSchema()
  }

  /** =============================== */
  /** ==========  Validate  ========= */
  /** =============================== */
  private isType(input: InputValue) {
    return toRawType(input.value) === 'boolean'
  }

  public _validate(input: InputValue): ValidateReturnType<this['_Out']> {
    if (!this.isType(input)) return Invalid
    return Valid(input.value)
  }

  /** =============================== */
  /** ==========  Feature  ========== */
  /** =============================== */
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

  /** =============================== */
  /** ==========  Validate  ========= */
  /** =============================== */
  private isType(input: InputValue) {
    const isDate = toRawType(input.value) === 'date'
    return isDate && !Number.isNaN(input.value?.getTime())
  }

  public _validate(input: InputValue): ValidateReturnType<this['_Out']> {
    if (!this.isType(input)) return Invalid
    return Valid(input.value)
  }
  /** =============================== */
  /** ==========  Feature  ========== */
  /** =============================== */

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
/** EnumSchema                                                                 */
/** ========================================================================== */
/** ========================================================================== */

/** types ==================================================================== */

export type EnumType = string | number | symbol | boolean
export type EnumInput = Readonly<[EnumType, ...EnumType[]]>

/** schema =================================================================== */

export class EnumSchema<T extends EnumInput> extends BaseSchema<T, T[number]> {
  constructor(private readonly innerType: T) {
    super()
  }

  static create<U extends string, E extends Readonly<[U, ...U[]]>>(
    enums: E
  ): EnumSchema<Writable<E>>
  static create<U extends string, E extends [U, ...U[]]>(enums: E) {
    return new EnumSchema<E>(enums)
  }

  /** =============================== */
  /** ==========  Validate  ========= */
  /** =============================== */
  private isType(input: InputValue) {
    return toRawType(input.value) === 'string'
  }

  public _validate(input: InputValue): ValidateReturnType<this['_Out']> {
    if (!this.isType(input)) return Invalid
    return Valid(input.value)
  }

  /** =============================== */
  /** ==========  Feature  ========== */
  /** =============================== */

  private get enum() {
    return this.innerType
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

  /** =============================== */
  /** ==========  Validate  ========= */
  /** =============================== */

  private isType(input: InputValue) {
    if (Number.isNaN(input.value)) {
      return false
    }
    return toRawType(input.value) === 'number'
  }

  public _validate(input: InputValue): ValidateReturnType<this['_Out']> {
    if (!this.isType(input)) return Invalid
    return Valid(input.value)
  }

  /** =============================== */
  /** ==========  Feature  ========== */
  /** =============================== */

  min(num: number, message?: Message) {
    return this.test((value: number) => value >= num, message)
  }

  max(num: number, message?: Message) {
    return this.test((value: number) => value <= num, message)
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

  /** =============================== */
  /** ==========  Validate  ========= */
  /** =============================== */
  private isType(input: InputValue) {
    return toRawType(input.value) === 'string'
  }

  public _validate(input: InputValue): ValidateReturnType<this['_Out']> {
    if (!this.isType(input)) return Invalid
    return Valid(input.value)
  }

  /** =============================== */
  /** ==========  Feature  ========== */
  /** =============================== */

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
    return this.test((value) => /email/.test(value), message)
  }

  // TODO
  uuid(email: string, message?: Message) {
    return this.test((value) => /uuid/.test(value), message)
  }
}

/** ========================================================================== */
/** ========================================================================== */
/** RefSchema                                                               */
/** ========================================================================== */
/** ========================================================================== */

// TODO: 后续开发
