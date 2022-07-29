/* eslint-disable max-classes-per-file */
/* eslint-disable no-underscore-dangle */
import { Message, EffectType, Rule } from '../types'
import { InputValue, VALID, ValidateReturnType } from '../utils'

export default abstract class BaseSchema<Out = any, In = Out> {
  readonly _type!: any

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

  public constructor(type: string) {
    this._type = type
  }

  // 检查副作用
  private _effectTest(input?: any, context?: any) {
    const { effect } = this

    if (!effect.has('nullable') && input === null) {
      throw new Error('filed not null')
    }
  }

  private _preCheck(input?: any, context?: any) {
    const { effect } = this
    if (input === undefined) {
      const required = effect.has('required')
      if (required) throw new Error('field required')
      return // 默认全部为可选
    }
    if (input === null && effect.has('nullable')) return
    const res = this._typeCheck(input)
    if (!res) throw new Error('field type is error')
  }

  protected test(tester: Rule, message?: Message) {
    this.rules.push(makeRule<Input>(tester, message))
    return this
  }

  public async validate(input?: any) {
    this._preCheck(input) // 前置操作

    for (const rule of this.rules) {
      // eslint-disable-next-line no-await-in-loop
      const res = await rule(<Input>input)
      if (!res) throw new Error('error')
    }
    return input as Input
  }

  /** =============================== */
  /** ========== Operator =========== */
  /** =============================== */

  // 可以传 undefined
  public optional(): OptionalSchema<this> {
    return OptionalSchema.create(this) as any
  }

  // 可以传 null
  public nullable(): NullableSchema<this> {
    return NullableSchema.create(this) as any
  }

  // 可以传 null undefined
  public nullish() {
    return this.optional().nullable()
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

/** =============================== */
/** ========== Operator =========== */
/** =============================== */
