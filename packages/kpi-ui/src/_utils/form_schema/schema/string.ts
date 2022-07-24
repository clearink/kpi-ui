import { MayBe, NonUndefined, Message } from '../types'
import BaseSchema from './base'

export default class StringSchema<T extends MayBe<string>> extends BaseSchema<T, T> {
  constructor() {
    super('string', (input): input is NonNullable<T> => {
      if (input instanceof String) input = input.valueOf()
      return typeof input === 'string'
    })
  }

  static create() {
    return new StringSchema<string | undefined>()
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

  public required(): StringSchema<NonUndefined<T>> {
    return super.required()
  }

  public optional(): StringSchema<T | undefined> {
    return super.optional()
  }

  public nullable(): StringSchema<T | null> {
    return super.nullable()
  }

  public nullish() {
    return this.optional().nullable()
  }
}
