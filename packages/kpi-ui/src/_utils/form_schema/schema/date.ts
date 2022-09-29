/* eslint-disable class-methods-use-this */
import { isDate } from '../../is'
import BaseSchema from './base'
import { date as locale } from '../locales/default'
import { Message } from '../interface'
import { makeRule } from '../shared/make_rule'
import { MayBe } from '../../../_types'

export default class DateSchema extends BaseSchema<Date> {
  static create() {
    return new DateSchema()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */
  protected isType(value: MayBe<Date>) {
    return isDate(value) && !Number.isNaN(value.getTime())
  }

  _validate() {
    // TODO
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  min(min: Date, message: Message = locale.min) {
    // TODO: 后续传值可以自行解析(是否需要呢？)
    const rule = (value: Date) => value >= min
    return this._refine('min', makeRule(rule, message, { min }))
  }

  max(max: Date, message: Message = locale.max) {
    // TODO: 后续传值可以自行解析(是否需要呢？)
    const rule = (value: Date) => value <= max
    return this._refine('max', makeRule(rule, message, { max }))
  }
}
