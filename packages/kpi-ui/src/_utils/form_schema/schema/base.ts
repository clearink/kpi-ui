/* eslint-disable import/no-cycle */
/* eslint-disable max-classes-per-file */
import { Message, EffectType, Rule } from '../types'
import { InputValue, toRawType, ValidateReturnType } from '../utils'
import NullableSchema from './nullable'
import OptionalSchema from './optional'

export default abstract class BaseSchema<Out = any, In = Out> {
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
