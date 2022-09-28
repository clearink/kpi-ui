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

  min(num: number, message: Message = locale.min) {
    const rule = (value: number) => value >= num
    return this._refine('min', makeRule(rule, message, { min: num }))
  }

  max(num: number, message: Message = locale.max) {
    const rule = (value: number) => value <= num
    return super._refine('max', makeRule(rule, message, { max: num }))
  }

  range(min: number, max: number, message: Message = locale.range) {
    // 如果直接使用 min max 方法，在执行的时候无法拿到对应的 params 错误信息就没有办法显示了
    // 但是我又想用min/max 覆盖 range 所以要调用 this.min/this.max
    // 有没有办法将 params 传递出去呢？
    // const rule = (value: number) => value >= min && value <= max
    // return this._refine('range', makeRule(rule, message, { min, max }))

    // TODO: 待确定如果传递 params 参数
    return this.min(min, message).max(max, message)
  }

  equal(num: number, message: Message = locale.equal) {
    const rule = (value: number) => value === num
    return this._refine('equal', makeRule(rule, message, { equal: num }))
  }

  positive(message: Message = locale.positive) {
    return this.refine((value: number) => value > 0, message)
  }

  negative(message: Message = locale.negative) {
    return this.refine((value: number) => value < 0, message)
  }

  integer(message?: Message) {
    return this.refine(Number.isInteger, message)
  }
}
