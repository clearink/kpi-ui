import { NonUndefined, ObjectShape, MakePartial, MayBe, FilterSchema } from '../types'
import BaseSchema from './base'

export default class ObjectSchema<T extends MayBe<ObjectShape>> extends BaseSchema<
  T,
  MakePartial<T>
> {
  public readonly shape!: T

  constructor(shape: T) {
    // TODO: 待优化 仅支持 plain object
    super('object', (input): input is NonNullable<T> => {
      return typeof input === 'object' && input !== null
    })
    this.shape = shape
  }

  static create<S extends ObjectShape = {}>(shape?: S) {
    return new ObjectSchema<FilterSchema<S> | undefined>(shape as any)
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
