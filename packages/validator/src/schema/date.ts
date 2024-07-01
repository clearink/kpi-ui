import { isDate, isUndefined } from '@kpi-ui/utils'

import type { Context, Message } from '../interface'
import { date } from '../locales/default'
import { Invalid, makeRule, Valid } from '../make_rule'
import BaseSchema from './base'

export default class DateSchema extends BaseSchema<Date | undefined> {
  static create(message: Message = date.invalid) {
    return new DateSchema(message)
  }

  constructor(private message: Message = date.invalid) {
    super()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */
  _validate(value: Date | undefined, context: Context) {
    if (isUndefined(value)) return Valid(value)

    if (!isDate(value) || Number.isNaN(value.getTime())) {
      return Invalid(context)(this.message, { value })
    }
    return super._validate(value, context)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  min(min: Date, message: Message = date.min) {
    const rule = (value: Date) => value >= min
    return this._refine('min', makeRule(rule, message, { min }))
  }

  max(max: Date, message: Message = date.max) {
    const rule = (value: Date) => value <= max
    return this._refine('max', makeRule(rule, message, { max }))
  }
}
