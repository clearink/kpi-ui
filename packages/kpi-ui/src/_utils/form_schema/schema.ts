/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { AnyObject, Full, MayBe, NonUndefined, Writable } from '../../_types'
import { Invalid, Valid, makeRule } from './shared'
import { ValidateResult, Message, RuleHandler, EffectHandler, ValidateReturn } from './interface'
import { isArray, isBoolean, isDate, isNull, isNumber, isObject, isString, isUndefined } from '..'

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

  private flag: Record<'optional' | 'nullable', boolean> = {
    optional: true, // 默认能传 undefined
    nullable: false, // 默认不能传 null
  }

  // 条件
  protected readonly conditions: any[] = []

  // 规则
  protected readonly rules: ValidateReturn<Out>[] = []

  // 内部校验

  // 校验类型
  abstract isType(value: any): boolean

  private _runInternalTests(value: any) {
    if (this.flag.optional) {
      return isUndefined(value) ? Valid(value) : Invalid
    }
    if (this.flag.nullable) {
      return isNull(value) ? Valid(value) : Invalid
    }
    return Valid(value)
  }

  private _runEffects(value: any) {
    return this.transforms.reduce((acc, fn) => {
      return fn.call(this, acc, value, this.context)
    }, value)
  }

  private _runRules(value: any) {
    const list = this.rules.map((rule) => rule(value, this.context))
  }

  // 获取 context 从而传递给 _validate
  public async validate(value: any) {
    const input: ValidateInput = {
      value,
      context: this.context,
      path: [],
    }
    // 校验 内部
    this._runInternalTests(value)
    // 转换数据 transform
    const inputVale = this._runEffects(value)
    const result = await this._runRules(input)
    if (result.status === 'valid') {
      return result.value
    }
    return result.status
  }

  // 获取 context
  private get context() {
    return this
  }

  /** ==================================================== */
  /** operator                                             */
  /** ==================================================== */

  // 可以传 undefined
  public optional() {
    this.flag.optional = true
    return this
  }

  // 不能传 undefined
  public defined(message?: Message) {
    this.flag.optional = false
    return this
  }

  // 可以传 null
  public nullable() {
    this.flag.nullable = true
    return this
  }

  // 不能传 null
  public nonNullable(message?: Message) {
    this.flag.nullable = false
    return this
  }

  // 不可以传 undefined, null
  public required(message?: Message) {
    return this.defined(message).nonNullable(message)
  }

  // 可以传 undefined, null
  public nullish() {
    return this.optional().nullable()
  }

  /** ==================================================== */
  /** transform                                            */
  /** ==================================================== */

  private transforms: EffectHandler[] = []

  public transform(handler: EffectHandler) {
    this.transforms.push(handler)
    return this
  }

  // refine 自定义验证
  public refine(handler: RuleHandler, message?: Message) {
    this.rules.push(makeRule<In>(handler, message))
    return this
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

  public isType() {
    return true
  }

  public _validate(input: ValidateInput) {
    return Valid(input.value)
  }
}

/** ========================================================================== */
/** ========================================================================== */
/** NumberSchema                                                               */
/** ========================================================================== */
/** ========================================================================== */

export class NumberSchema<T extends number | undefined> extends BaseSchema<T> {
  static create<S extends number | undefined>() {
    return new NumberSchema<S>()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */
  public isType(value: any) {
    // NaN 视为错误
    return isNumber(value) && !Number.isNaN(value)
  }

  public _validate(input: ValidateInput) {
    if (!this.isType(input.value)) return Invalid
    return Valid(input.value)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  min(num: number, message?: Message) {
    return this.refine((value: number) => value >= num, message)
  }

  max(num: number, message?: Message) {
    return this.refine((value: number) => value <= num, message)
  }

  range(min: number, max: number, message?: Message) {
    return this.min(min, message).max(max, message)
  }

  equal(num: number, message?: Message) {
    return this.refine((value: number) => value === num, message)
  }

  positive(message?: Message) {
    return this.refine((value: number) => value > 0, message)
  }

  negative(message?: Message) {
    return this.refine((value: number) => value < 0, message)
  }

  integer(message?: Message) {
    return this.refine(Number.isInteger, message)
  }
}

/** ========================================================================== */
/** ========================================================================== */
/** StringSchema                                                               */
/** ========================================================================== */
/** ========================================================================== */

export class StringSchema<T extends string | undefined> extends BaseSchema<T> {
  static create<S extends string | undefined>() {
    return new StringSchema<S>()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */
  public isType = isString

  public _validate(input: ValidateInput) {
    if (!this.isType(input)) return Invalid
    return Valid(input.value)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  min(len: number, message?: Message) {
    return this.refine((value) => value.length >= len, message)
  }

  max(len: number, message?: Message) {
    return this.refine((value) => value.length <= len, message)
  }

  length(len: number, message?: Message) {
    return this.refine((value) => value.length === len, message)
  }

  // TODO
  email(message?: Message) {
    return this.refine((value) => /email/.test(value), message)
  }

  // TODO
  uuid(message?: Message) {
    return this.refine((value) => /uuid/.test(value), message)
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
  public isType = isBoolean

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
  public isType(input: ValidateInput) {
    return isDate(input.value) && !Number.isNaN(input.value.getTime())
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

  public isType = (input: ValidateInput) => {
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
  public isType(input: any) {
    return isArray(input)
  }

  public _validate(input: ValidateInput) {
    if (!this.isType(input.value)) return Invalid
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
  public isType(input: T[number]) {
    return this.innerType.includes(input)
  }

  public _validate(input: ValidateInput) {
    if (!this.isType(input.value)) return Invalid
    return Valid(input.value)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  private get enum() {
    return this.innerType
  }
}
