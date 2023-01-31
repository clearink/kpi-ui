import { hasOwn, isNullish } from '@kpi/shared'
import EffectSchema from './effect'
import UnionSchema from './union'
import { base } from '../locales/default'
import SchemaContext from '../context'
import { makeRule, Valid } from '../make_rule'

import type { Context, MakeRuleReturn, Message, Options, ValidateReturn } from '../interface'

export default abstract class BaseSchema<Out = any, In = Out> {
  readonly _In!: In

  readonly _Out!: Out

  // 暂不提供同步校验方法
  async validate(value: any, options?: Options) {
    const context = SchemaContext.ensure({ ...options, issue: undefined })
    const ret = await this._validate(value, context)
    if (ret.status === 'valid') return ret.value
    throw context.issue
  }

  // 内部校验
  _validate(value: Out, context: Context): ValidateReturn<Out> {
    const list = [...this.rules.values()].map((rule) => rule(value, context))
    return Promise.all(list).then((results) => {
      for (const result of results) {
        if (result.status === 'invalid') return result
      }
      return Valid(value)
    })
  }

  // 规则
  private readonly rules = new Map<string | number, MakeRuleReturn<Out>>()

  protected _refine(name: string | number, rule: MakeRuleReturn<any>) {
    this.rules.set(name, rule)
    return this
  }

  // 删除某一项规则
  protected _remove(name: string | number) {
    this.rules.delete(name)
    return this
  }

  /** ==================================================== */
  /** operator                                             */
  /** ==================================================== */

  required(message: Message = base.required): EffectSchema<this, NonNullable<Out>> {
    const rule = (value: any) => !isNullish(value)
    return EffectSchema.required(this, makeRule(rule, message)) as any
  }

  isRequired() {
    let tail = this

    while (tail && hasOwn(tail, 'unwrap')) {
      if (!(tail instanceof EffectSchema)) break

      const type = tail._type
      if (type === 'required') return true
      if (type === 'nullable') return false

      tail = tail.unwrap()
    }

    return false
  }

  // 可以传 null
  nullable(): EffectSchema<this, Out | null> {
    return EffectSchema.nullable(this) as any
  }

  /** alias or */
  union<U extends BaseSchema>(schema: U): UnionSchema<[this, U]> {
    return UnionSchema.create([this, schema])
  }

  or<U extends BaseSchema>(schema: U): UnionSchema<[this, U]> {
    return UnionSchema.create([this, schema])
  }

  // refine 自定义验证
  refine<Next extends Out>(
    rule: (value: Out) => value is Next,
    message?: Message
  ): EffectSchema<this, Next>
  refine(
    rule: (value: Out) => boolean | Promise<boolean>,
    message?: Message
  ): EffectSchema<this, Out>
  refine(
    rule: (value: Out) => boolean | Promise<boolean>,
    message: Message = base.invalid
  ): EffectSchema<this, Out> {
    return EffectSchema.refinement(this, rule, message)
  }

  // 数据转换
  transform<Next>(handler: (value: Out) => Next | Promise<Next>): EffectSchema<this, Next> {
    return EffectSchema.transform(this, handler) as any
  }

  // 数据预处理
  preprocess<Next>(handler: (value: any) => Next | Promise<Next>): EffectSchema<this, Next> {
    return EffectSchema.preprocess(this, handler)
  }
}
