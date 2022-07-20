/* eslint-disable import/no-cycle */
import { MayBe, NonUndefined, Message, ObjectShape } from '../types/schema'
import BaseSchema from './base'

export default class ObjectSchema<T extends MayBe<ObjectShape>> extends BaseSchema<T> {
  public readonly shape!: T

  constructor(shape: T) {
    // TODO: 待优化 仅支持 plain object
    super('object', (input): input is NonNullable<T> => {
      return typeof input === 'object' && input !== null
    })
    this.shape = shape
  }

  static create<S extends ObjectShape = {}>(shape?: S) {
    return new ObjectSchema(shape!)
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

  public nullish() {
    return this.optional().nullable()
  }
}
