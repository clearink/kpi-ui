/* eslint-disable class-methods-use-this */
import { isBoolean } from '../../is'
import BaseSchema from './base'
import { boolean as locale } from '../locales/default'
import { Message } from '../interface'
import { makeRule } from '../shared/make_rule'
import { MayBe } from '../../../_types'

export default class BooleanSchema<T extends boolean | undefined> extends BaseSchema<T> {
  static create<S extends boolean | undefined>() {
    return new BooleanSchema<S>()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */
  protected isType(value: MayBe<boolean>) {
    return isBoolean(value)
  }

  _validate() {
    // TODO
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  true(message: Message = locale.true) {
    const rule = (value: boolean) => value === true
    return this._refine('boolean', makeRule(rule, message))
  }

  // 二者也是互斥的，不能既是 true 又是 false 吧
  false(message: Message = locale.false) {
    const rule = (value: boolean) => value === false
    return this._refine('boolean', makeRule(rule, message))
  }
}
