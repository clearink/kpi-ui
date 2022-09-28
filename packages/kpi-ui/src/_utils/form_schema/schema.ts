/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { AnyObject, Full, MayBe, NonUndefined, Writable } from '../../_types'
import { Invalid, Valid, makeRule } from './shared'
import { Message, RuleHandler, EffectHandler, RuleName, RuleValue, MakeRuleReturn } from './interface'
import {
  isArray,
  isBoolean,
  isDate,
  isNull,
  isNumber,
  isObject,
  isString,
  isUndefined,
} from '../is'
import { base as locale,string as stringLocale, number as numberLocale } from './locales/default'

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

  private _rid = 0

  private get rid() {
    return this._rid++
  }

  private internals = new Map<'optional' | 'nullable', MakeRuleReturn>()

  public constructor() {
    this.notNull()
  }

  // 校验类型
  abstract isType(value: any): boolean

  // 校验内部规则 TODO: 待优化一下
  private _runInternalRules(value: any) {
    for (const rule of this.internals.values()) {
      if (!rule(value)) return Invalid(value)
    }
    return Valid(value)
  }

  // 数据转换
  private _runEffects(value: any) {
    return this.transforms.reduce((acc, fn) => {
      return fn.call(this, acc, value, this.context)
    }, value)
  }

  // 定义的规则
  private _runRules(value: any) {
    const rules = [...this.rules.values()].map(rule => rule())
  }

  // 获取 context 从而传递给 _validate
  public async validate(value: any) {
    // 校验 内部
    const ret = this._runInternalRules(value)
    if (ret.status === 'invalid') {
      return ret
    }
    // 转换数据 transform
    const $value = this._runEffects(value)

    const result = await this._runRules($value)
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
    this.internals.delete('optional')
    return this
  }

  // 不能传 undefined
  public defined(message: Message = locale.defined) {
    this.internals.set('optional', makeRule(isUndefined, message))
    return this
  }

  // 可以传 null
  public nullable() {
    this.internals.delete('nullable')
    return this
  }

  // 不能传 null
  public notNull(message: Message = locale.notNull) {
    this.internals.set('nullable', makeRule(isNull, message))
    return this
  }

  // 不可以传 undefined, null
  public required(message: Message = locale.required) {
    return this.defined(message).notNull(message)
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

  // 规则
  private readonly rules = new Map<RuleName, MakeRuleReturn>()

  protected _refine(name: RuleName, rule: MakeRuleReturn) {
    this.rules.set(name, rule)
    return this
  }

  // refine 自定义验证
  public refine(rule: RuleHandler, message: Message) {
    // 如果不提供 name 就自己生成一个，作为唯一id
    this.rules.set(this.rid, makeRule(rule, message))
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

  min(num: number, message: Message = locale.) {
    const rule = (value: number) => value >= num
    return this._refine('min', makeRule(rule, message, { min: num })
  }

  max(num: number, message?: Message) {
    const rule = (value: number) => value <= num
    return super._refine('max', {
      rule,
      params: { max: num },
      message,
    })
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

  range(min: number, max: number, message?: Message) {
    return this.min(min, message).max(max, message)
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
