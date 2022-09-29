/* eslint-disable class-methods-use-this */
import { isNumber } from '../../is'
import BaseSchema from './base'
import { number as locale } from '../locales/default'
import { Message } from '../interface'
import { makeRule } from '../shared/make_rule'
import { MayBe } from '../../../_types'

export default class NumberSchema<T extends number | undefined> extends BaseSchema<T> {
  static create<S extends number | undefined>() {
    return new NumberSchema<S>()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */
  protected isType(value: MayBe<number>) {
    // NaN 视为错误
    return isNumber(value) && !Number.isNaN(value)
  }

  _validate() {
    // TODO
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  min(min: number, message: Message = locale.min) {
    const rule = (value: number) => value >= min
    return this._refine('min', makeRule(rule, message, { min }))
  }

  max(max: number, message: Message = locale.max) {
    const rule = (value: number) => value <= max
    return this._refine('max', makeRule(rule, message, { max }))
  }

  equal(equal: number, message: Message = locale.equal) {
    const rule = (value: number) => value === equal
    return this._refine('equal', makeRule(rule, message, { equal }))
  }

  range(min: number, max: number, message: Message = locale.range) {
    const rule = (value: number) => value >= min && value <= max
    return this._refine('range', makeRule(rule, message, { min, max }))
  }

  positive(message: Message = locale.positive) {
    const rule = (value: number) => value > 0
    return this._refine('positive', makeRule(rule, message))
  }

  negative(message: Message = locale.negative) {
    const rule = (value: number) => value < 0
    return this._refine('negative', makeRule(rule, message))
  }

  integer(message: Message = locale.integer) {
    return this._refine('integer', makeRule(Number.isInteger, message))
  }
}
