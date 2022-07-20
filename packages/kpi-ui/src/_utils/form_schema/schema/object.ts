import { MayBe, NonUndefined, Message } from '../types/schema'
import BaseSchema from './base'

export default class ObjectSchema<T extends MayBe<Record<string, any>>> extends BaseSchema<T> {
  constructor(shape: T) {
    // TODO: 待优化 仅支持 plain object
    super('object', (input): input is NonNullable<T> => {
      return typeof input === 'object' && input !== null
    })
  }

  static create(shape?: MayBe<Record<string, BaseSchema>>) {
    return new ObjectSchema(shape)
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

  public required(): ObjectSchema<NonUndefined<T>> {
    return super.required()
  }

  public optional(): ObjectSchema<T | undefined> {
    return super.optional()
  }

  public nullable(): ObjectSchema<T | null> {
    return super.nullable()
  }

  public nullish(): ObjectSchema<MayBe<T>> {
    return super.nullish()
  }
}
