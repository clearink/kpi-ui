/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line max-classes-per-file
import { Message, EffectType, Rule, TypeChecker } from '../types/schema'

export default abstract class BaseSchema<T extends unknown = unknown> {
  // eslint-disable-next-line no-underscore-dangle
  readonly _type!: T

  // 条件
  private readonly conditions: any[] = []

  private readonly _typeCheck!: TypeChecker<T>

  // 记录副作用
  private readonly effect: Set<EffectType> = new Set()

  // 记录数据转换函数， 在类型检查之前进行
  private readonly transforms: any[] = []

  private readonly rules: Rule[] = []

  public constructor(type: string, check: TypeChecker<T>) {
    this._typeCheck = check
    this._type = type as T
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
    this.rules.push(makeRule<T>(tester, message))
    return this
  }

  public async validate(input?: any) {
    this._preCheck(input) // 前置操作

    for (const rule of this.rules) {
      // eslint-disable-next-line no-await-in-loop
      const res = await rule(<T>input)
      if (!res) throw new Error('error')
    }
    return input as T
  }

  /** =============================== */
  /** ========== Operator =========== */
  /** =============================== */

  // 不能传 undefined
  protected required(): any {
    this.effect.add('required')
    return this
  }

  // 可以传 undefined
  protected optional(): any {
    this.effect.delete('required')
    return this
  }

  // 可以传 null
  protected nullable(): any {
    this.effect.add('nullable')
    return this
  }

  // 可以传 null undefined
  protected nullish(): any {
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

/** ================================================ */
/** ================================================ */
/** ================     And     =================== */
/** ================================================ */
/** ================================================ */

/** ================================================ */
/** ================================================ */
/** ===============      or      =================== */
/** ================================================ */
/** ================================================ */
