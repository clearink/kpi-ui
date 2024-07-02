import { isNumber, isUndefined } from '@kpi-ui/utils'

import type { Context, Message } from '../interface'

import { number } from '../locales/default'
import { Invalid, Valid, makeRule } from '../make_rule'
import BaseSchema from './base'

export default class NumberSchema extends BaseSchema<number | undefined> {
  constructor(private message: Message = number.invalid) {
    super()
  }

  static create(message: Message = number.invalid) {
    return new NumberSchema(message)
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  _validate(value: number | undefined, context: Context) {
    if (isUndefined(value)) return Valid(value)

    if (!isNumber(value) || Number.isNaN(value))
      return Invalid(context)(this.message, { value })

    return super._validate(value, context)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  equal(equal: number, message: Message = number.equal) {
    const rule = (value: number) => value === equal
    return this._refine('equal', makeRule(rule, message, { equal }))
  }

  integer(message: Message = number.integer) {
    const rule = (value: number) => Number.isInteger(value)
    return this._refine('integer', makeRule(rule, message))
  }

  max(max: number, message: Message = number.max) {
    const rule = (value: number) => value <= max
    return this._refine('max', makeRule(rule, message, { max }))
  }

  min(min: number, message: Message = number.min) {
    const rule = (value: number) => value >= min
    return this._refine('min', makeRule(rule, message, { min }))
  }

  negative(message: Message = number.negative) {
    const rule = (value: number) => value < 0
    return this._refine('negative', makeRule(rule, message))
  }

  positive(message: Message = number.positive) {
    const rule = (value: number) => value > 0
    return this._refine('positive', makeRule(rule, message))
  }

  range(min: number, max: number, message: Message = number.range) {
    const rule = (value: number) => value >= min && value <= max
    return this._refine('range', makeRule(rule, message, { max, min }))
  }
}
