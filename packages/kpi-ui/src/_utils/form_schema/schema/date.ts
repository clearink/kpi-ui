import { MayBe, NonUndefined, Message } from '../types'
import BaseSchema from './base'

export default class DateSchema<T extends MayBe<Date> = Date | undefined> extends BaseSchema<T, T> {
  constructor() {
    super('string', (input): input is NonNullable<T> => {
      if (input instanceof Date) {
        return !Number.isNaN(input.getTime())
      }
      return false
    })
  }

  static create() {
    return new DateSchema<Date | undefined>()
  }

  /** =============================== */
  /** ==========  Validate  ========= */
  /** =============================== */

  /** =============================== */
  /** ==========  Feature  ========== */
  /** =============================== */

  min(len: number, message?: Message) {
    return this.test((value) => value.length >= len, message)
  }

  max(len: number, message?: Message) {
    return this.test((value) => value.length <= len, message)
  }

  length(len: number, message?: Message) {
    return this.test((value) => value.length === len, message)
  }

  // TODO
  email(email: string, message?: Message) {
    return this.test((value) => /some/.test(value), message)
  }

  // TODO
  uuid(email: string, message?: Message) {
    return this.test((value) => /uuid/.test(value), message)
  }

  /** =============================== */
  /** ========== Operator =========== */
  /** =============================== */

  public required(): DateSchema<NonUndefined<T>> {
    return super.required()
  }

  public optional(): DateSchema<T | undefined> {
    return super.optional()
  }

  public nullable(): DateSchema<T | null> {
    return super.nullable()
  }

  public nullish() {
    return this.optional().nullable()
  }
}
