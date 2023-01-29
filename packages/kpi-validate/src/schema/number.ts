import { isNumber, isUndefined } from '@kpi/shared'
import BaseSchema from './base'
import { number } from '../locales/default'
import { Invalid, makeRule, Valid } from '../make_rule'

import type { Context, Message } from '../interface'

export default class NumberSchema extends BaseSchema<number | undefined> {
  static create(message: Message = number.invalid) {
    return new NumberSchema(message)
  }

  constructor(private message: Message = number.invalid) {
    super()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  _validate(value: number | undefined, context: Context) {
    if (isUndefined(value)) return Valid(value)

    if (!isNumber(value) || Number.isNaN(value)) {
      return Invalid(context)(this.message, { value })
    }
    return super._validate(value, context)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  min(min: number, message: Message = number.min) {
    const rule = (value: number) => value >= min
    return this._refine('min', makeRule(rule, message, { min }))
  }

  max(max: number, message: Message = number.max) {
    const rule = (value: number) => value <= max
    return this._refine('max', makeRule(rule, message, { max }))
  }

  equal(equal: number, message: Message = number.equal) {
    const rule = (value: number) => value === equal
    return this._refine('equal', makeRule(rule, message, { equal }))
  }

  range(min: number, max: number, message: Message = number.range) {
    const rule = (value: number) => value >= min && value <= max
    return this._refine('range', makeRule(rule, message, { min, max }))
  }

  positive(message: Message = number.positive) {
    const rule = (value: number) => value > 0
    return this._refine('positive', makeRule(rule, message))
  }

  negative(message: Message = number.negative) {
    const rule = (value: number) => value < 0
    return this._refine('negative', makeRule(rule, message))
  }

  integer(message: Message = number.integer) {
    const rule = (value: number) => Number.isInteger(value)
    return this._refine('integer', makeRule(rule, message))
  }
}
