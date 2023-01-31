import { isUndefined, omit } from '@kpi/shared'
import BaseSchema from './base'
import SchemaContext from '../context'
import { union } from '../locales/default'
import { Invalid, Valid } from '../make_rule'

import type { Context, InValidType, RuleReturn } from '../interface'

export type UnionInput = readonly [BaseSchema, BaseSchema, ...BaseSchema[]]
export type UnionInnerReturn<T> = (readonly [Context, RuleReturn<T>])[]

export default class UnionSchema<
  T extends UnionInput,
  Out = T[number]['_Out'] | undefined,
  In = T[number]['_In'] | undefined
> extends BaseSchema<Out, In> {
  static create<U extends UnionInput>(inner: U) {
    return new UnionSchema(inner)
  }

  constructor(private inner: T) {
    super()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  async _validate(value: Out, context: Context) {
    if (isUndefined(value)) return Valid(value)

    const results: UnionInnerReturn<Out> = await Promise.all(
      this.inner.map(async (schema) => {
        const ctx = SchemaContext.ensure(omit(context, ['issue']))
        try {
          return [ctx, await schema._validate(value, ctx)]
        } catch (error) {
          return [ctx, error as InValidType]
        }
      })
    )

    // 存在合法的就返回
    for (const [, result] of results) {
      if (result.status === 'valid') return result
    }

    // TODO: 需要手段检测是否为 invalid_type 错误
    for (const [, result] of results) {
      if (result.status === 'invalid') {
        // 存在不是 invalid_type 的错误
        return result
      }
    }

    // 如果 results 都是 invalid_type 就联合成一个 invalid_type
    // if(isAllInvalidType) return Invalid(xxx)

    // // TODO: 合并所有的错误信息,如何去除错误的类型判断呢?
    // const innerIssues = results.reduce((res, [ctx]) => {
    //   return res.concat(ctx.issue.issues)
    // }, [] as SchemaIssue[])

    // context.issue.issues.push(...innerIssues)
    return Invalid(context)(union.invalid, { value })
  }
}
