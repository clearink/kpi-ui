import { MayBe, NonUndefined, Message } from '../types'
import BaseSchema from './base'

export default class NumberSchema<T extends MayBe<number>> extends BaseSchema<T, T> {
  constructor() {
    // TODO: bigInt Infinity 与 nan 是否需要排除?
    super('number', (input): input is NonNullable<T> => {
      if (input instanceof Number) input = input.valueOf()
      return typeof input === 'number'
    })
  }

  static create() {
    return new NumberSchema<number | undefined>()
  }

  /** =============================== */
  /** ==========  Validate  ========= */
  /** =============================== */

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

  /** =============================== */
  /** ========== Operator =========== */
  /** =============================== */

  public required(): NumberSchema<NonUndefined<T>> {
    return super.required()
  }

  public optional(): NumberSchema<T | undefined> {
    return super.optional()
  }

  public nullable(): NumberSchema<T | null> {
    return super.nullable()
  }

  public nullish(): NumberSchema<MayBe<T>> {
    return super.nullish()
  }
}
