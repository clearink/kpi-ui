/* eslint-disable no-underscore-dangle */
import { NonUndefined, Message } from '../types'
import { InputValue, ValidateReturnType } from '../utils'
import BaseSchema from './base'

export default class NumberSchema extends BaseSchema<number> {
  constructor() {
    // TODO: bigInt Infinity 与 nan 是否需要排除?
    super('number')
  }

  static create() {
    return new NumberSchema()
  }

  /** =============================== */
  /** ==========  Validate  ========= */
  /** =============================== */

  public _validate(input: InputValue): ValidateReturnType<this['_Out']> {
    return input.value
  }

  /** =============================== */
  /** ==========  Feature  ========== */
  /** =============================== */

  min(num: number, message?: Message) {
    return this.test((value: number) => value >= num, message)
  }

  max(num: number, message?: Message) {
    return this.test((value: number) => value <= num, message)
  }

  equal(num: number, message?: Message) {
    return this.test((value: number) => value === num, message)
  }

  positive(message?: Message) {
    return this.test((value: number) => value > 0, message)
  }

  negative(message?: Message) {
    return this.test((value: number) => value < 0, message)
  }

  integer(message?: Message) {
    // 注意 isInteger 不兼容ie
    return this.test((value: number) => Number.isInteger(value), message)
  }
}
