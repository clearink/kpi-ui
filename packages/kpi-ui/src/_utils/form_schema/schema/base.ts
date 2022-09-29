/* eslint-disable class-methods-use-this */
import { EffectHandler, MakeRuleReturn, Message, RuleHandler } from '../interface'
import { makeRule } from '../shared/make_rule'
import { base as locale } from '../locales/default'
import { isNull, isUndefined } from '../../is'
import { MayBe } from '../../../_types'

export default abstract class BaseSchema<Out = any, In = Out> {
  readonly _In!: In

  readonly _Out!: Out

  constructor() {
    this.notNull()
  }

  // 校验类型
  protected isType(value: MayBe<Out>) {
    return true
  }

  // 校验内部规则
  private internals = new Map<'defined' | 'notNull', MakeRuleReturn>()

  private async _runInternals(value: any) {
    const list = [...this.internals.values()].map((rule) => rule(value))
    return Promise.all(list)
  }

  // 数据转换
  private _runEffects(value: any) {
    return this.effects.reduce((acc, fn) => {
      return fn.call(this, acc, value, this.context)
    }, value)
  }

  // 定义的规则
  private async _runRules(value: MayBe<Out>) {
    const list = [...this.rules.values()].map((rule) => rule(value))
    return Promise.all(list)
    // const rules = [...this.rules.values()].map((rule) => rule())
  }

  // 获取 context 从而传递给 _validate
  async validate(value?: any) {
    // 校验 内部
    try {
      await this._runInternals(value)
      const $value = this._runEffects(value)
      // rules 为空 直接返回自身
      await this._runRules($value)
      // 这里是否返回被修改后的数据呢？
      return $value
    } catch (error) {
      return Promise.reject(error)
    }
    // if (ret.status === 'invalid') {
    //   return ret
    // }
    // // 转换数据 transform
    // const $value = this._runEffects(value)

    // const result = await this._runRules($value)
  }

  // 获取 context
  private get context() {
    return this
  }

  /** ==================================================== */
  /** operator                                             */
  /** ==================================================== */

  // 可以传 undefined
  optional() {
    this.internals.delete('defined')
    return this
  }

  // 不能传 undefined
  defined(message: Message = locale.defined) {
    const rule = (value: MayBe<Out>) => !isUndefined(value)
    this.internals.set('defined', makeRule(rule, message))
    return this
  }

  // 可以传 null
  nullable() {
    this.internals.delete('notNull')
    return this
  }

  // 不能传 null
  notNull(message: Message = locale.notNull) {
    const rule = (value: MayBe<Out>) => !isNull(value)
    this.internals.set('notNull', makeRule(rule, message))
    return this
  }

  // 不可以传 undefined, null
  required(message: Message = locale.required) {
    return this.defined(message).notNull(message)
  }

  // 可以传 undefined, null
  nullish() {
    return this.optional().nullable()
  }

  /** ==================================================== */
  /** transform                                            */
  /** ==================================================== */

  private effects: EffectHandler[] = []

  transform(handler: EffectHandler) {
    this.effects.push(handler)
    return this
  }

  // 规则
  private readonly rules = new Map<string | number, MakeRuleReturn>()

  protected _refine(name: string | number, rule: MakeRuleReturn) {
    this.rules.set(name, rule)
    return this
  }

  // refine 自定义验证
  private rid = 0

  refine(rule: RuleHandler, message: Message = locale.default) {
    // 如果不提供 name 就自己生成一个，作为唯一id
    return this._refine(this.rid++, makeRule(rule, message))
  }

  // 删除某一项规则
  remove(name: string | number) {
    this.rules.delete(name)
    return this
  }
}
