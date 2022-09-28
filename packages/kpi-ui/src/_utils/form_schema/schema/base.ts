import { EffectHandler, MakeRuleReturn, Message, RuleHandler } from '../interface'
import { Invalid, makeRule, Valid } from '../shared'
import { base as locale } from '../locales/default'
import { isNull, isUndefined } from '../../is'

export default abstract class BaseSchema<Out = any, In = Out> {
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
    const rules = [...this.rules.values()].map((rule) => rule())
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
  protected readonly rules = new Map<string | number, MakeRuleReturn>()

  protected _refine(name: string | number, rule: MakeRuleReturn) {
    this.rules.set(name, rule)
    return this
  }

  // refine 自定义验证
  public refine(rule: RuleHandler, message: Message) {
    // 如果不提供 name 就自己生成一个，作为唯一id
    return this._refine(this.rid, makeRule(rule, message))
  }
}
