import { MayBe, NonUndefined, Message } from '../types'
import BaseSchema from './base'

export default class BooleanSchema<T extends MayBe<boolean>> extends BaseSchema<T, T> {
  constructor() {
    super('number', (input): input is NonNullable<T> => {
      if (input instanceof Boolean) input = input.valueOf()
      return typeof input === 'boolean'
    })
  }

  static create() {
    return new BooleanSchema<boolean | undefined>()
  }

  /** =============================== */
  /** ==========  Validate  ========= */
  /** =============================== */

  /** =============================== */
  /** ==========  Feature  ========== */
  /** =============================== */

  /** =============================== */
  /** ========== Operator =========== */
  /** =============================== */

  public required(): BooleanSchema<NonUndefined<T>> {
    return super.required()
  }

  public optional(): BooleanSchema<T | undefined> {
    return super.optional()
  }

  public nullable(): BooleanSchema<T | null> {
    return super.nullable()
  }

  public nullish(): BooleanSchema<MayBe<T>> {
    return super.nullish()
  }
}
