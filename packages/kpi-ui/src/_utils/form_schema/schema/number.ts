/* eslint-disable class-methods-use-this */
import { isNumber } from '../../is'
import { ValidateInput } from '../schema'
import BaseSchema from './base'
import { number as locale } from '../locales/default'
import { Message } from '../interface'
import { makeRule } from '../shared'

export default class NumberSchema<T extends number | undefined> extends BaseSchema<T> {
  static create<S extends number | undefined>() {
    return new NumberSchema<S>()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */
  public isType(value: any) {
    // NaN 视为错误
    return isNumber(value) && !Number.isNaN(value)
  }

  public _validate(input: ValidateInput) {
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

  positive(message: Message = locale.positive) {
    const rule = (value: number) => value > 0
    // 覆盖 min 校验
    return this._refine('min', makeRule(rule, message))
  }

  negative(message: Message = locale.negative) {
    const rule = (value: number) => value < 0
    // 覆盖 max 校验
    return this._refine('max', makeRule(rule, message))
  }

  integer(message: Message = locale.integer) {
    return this._refine('integer', makeRule(Number.isInteger, message))
  }
}
