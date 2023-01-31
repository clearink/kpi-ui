import { isNull } from '@kpi/shared'
import BaseSchema from './base'
import { makeRule, Valid } from '../make_rule'

import type { Context, EffectOptions, Message, RuleReturn } from '../interface'

export default class EffectSchema<
  T extends BaseSchema<any>,
  Out = T['_Out'],
  In = T['_In']
> extends BaseSchema<Out, In> {
  // 数据转换 <NewOut>(value:Out) => NewOut | Promise<NewOut>
  // 可以改变数据类型
  static transform<S extends BaseSchema, Next = S['_Out']>(
    schema: S,
    handler: (value: S['_Out']) => Next | Promise<Next>
  ) {
    return new EffectSchema(schema, { type: 'transform', handler })
  }

  // 不改变数据类型
  static refinement<S extends BaseSchema, Out = S['_Out']>(
    schema: S,
    rule: (value: Out) => boolean | Promise<boolean>,
    message: Message
  ) {
    const handler = makeRule(rule, message)
    return new EffectSchema(schema, { type: 'refinement', handler })
  }

  // 改变后才进行校验
  static preprocess<S extends BaseSchema, Next = S['_Out']>(
    schema,
    handler: (value: S['_Out']) => Next | Promise<Next>
  ) {
    return new EffectSchema(schema, { type: 'preprocess', handler })
  }

  // 必填
  static required<S extends BaseSchema>(
    schema: S,
    handler: (value: S['_Out'], context: Context) => Promise<RuleReturn<S['_Out']>>
  ) {
    return new EffectSchema(schema, { type: 'required', handler })
  }

  // 可传 null
  static nullable<S extends BaseSchema>(schema: S) {
    return new EffectSchema(schema, { type: 'nullable' })
  }

  get _type() {
    return this.options.type
  }

  constructor(private schema: T, private options: EffectOptions<Out>) {
    super()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  async _validate(value: Out, context: Context) {
    const { options } = this
    if (options.type === 'transform') {
      // 先校验 后转换
      const ret = await this.schema._validate(value, context)
      if (ret.status === 'invalid') return ret
      const $value = await options.handler(value)
      return Valid($value)
    }
    // 预处理
    if (options.type === 'preprocess') {
      // 先转换 后校验
      const $value = await options.handler(value)
      return this.schema._validate($value, context)
    }

    if (options.type === 'nullable') {
      if (isNull(value)) return Valid(value)
      return this.schema._validate(value, context)
    }

    if (options.type === 'required') {
      const ret = await options.handler(value, context)
      if (ret.status === 'invalid') return ret
      return this.schema._validate(value, context)
    }

    // 先执行自身校验 后校验 handler
    const ret = await this.schema._validate(value, context)
    if (ret.status === 'invalid') return ret
    return options.handler(value, context)
  }

  unwrap() {
    return this.schema
  }
}
