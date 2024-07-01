import { isBoolean, isUndefined } from '@kpi-ui/utils'

import type { Context, Message } from '../interface'
import { boolean } from '../locales/default'
import { Invalid, makeRule, Valid } from '../make_rule'
import BaseSchema from './base'

export default class BooleanSchema extends BaseSchema<boolean | undefined> {
  static create(message: Message = boolean.invalid) {
    return new BooleanSchema(message)
  }

  constructor(private message: Message = boolean.invalid) {
    super()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  _validate(value: boolean | undefined, context: Context) {
    if (isUndefined(value)) return Valid(value)

    if (!isBoolean(value)) return Invalid(context)(this.message, { value })

    return super._validate(value, context)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  true(message: Message = boolean.true) {
    const rule = (value: boolean) => value === true
    return this._refine('boolean', makeRule(rule, message))
  }

  // 二者也是互斥的，不能既是 true 又是 false 吧
  false(message: Message = boolean.false) {
    const rule = (value: boolean) => value === false
    return this._refine('boolean', makeRule(rule, message))
  }
}
