import { isArray, isUndefined } from '@internal/utils'

import type { Context, Message } from '../interface'

import SchemaContext from '../context'
import { array } from '../locales/default'
import { Invalid, Valid, makeRule } from '../make_rule'
import AnySchema from './any'
import BaseSchema from './base'

export type MakeInnerType<T extends any[]> =
  T extends Array<infer I> ? (I extends BaseSchema ? I['_Out'][] : any[]) : any[]

/** schema =================================================================== */

export default class ArraySchema<
  T extends BaseSchema,
  Out = MakeInnerType<T[]> | undefined,
> extends BaseSchema<Out> {
  constructor(private readonly inner: T) {
    super()
  }

  static create<I extends BaseSchema>(inner?: I) {
    return new ArraySchema(inner ?? AnySchema.create())
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  async _validate(value: Out, context: Context) {
    if (isUndefined(value)) return Valid(value)

    if (!isArray(value)) return Invalid(context)(array.invalid, { value })

    const ret = await super._validate(value, context)

    if (ret.status === 'invalid') return ret
    return this._validateInner(value, context)
  }

  async _validateInner(value: Out & any[], context: Context) {
    const list = value.map((item, index) => {
      const ctx = SchemaContext.ensure(context, index)
      return this.inner._validate(item, ctx)
    })
    return Promise.all(list).then((results) => {
      for (let i = 0, len = results.length; i < len; i++) {
        const result = results[i]
        if (result.status === 'invalid') return result
      }
      // TODO: value 需要改变 因为内部可能会有 transform 改变了原始值
      return Valid(value)
    })
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  length(length: number, message: Message = array.length) {
    const rule = (value: any[]) => value.length === length
    return this._refine('length', makeRule(rule, message, { length }))
  }

  max(max: number, message: Message = array.max) {
    const rule = (value: any[]) => value.length <= max
    return this._refine('max', makeRule(rule, message, { max }))
  }

  min(min: number, message: Message = array.min) {
    const rule = (value: any[]) => value.length >= min
    return this._refine('min', makeRule(rule, message, { min }))
  }

  nonempty(message: Message = array.nonempty) {
    return this.min(1, message)
  }

  get element() {
    return this.inner
  }
}
