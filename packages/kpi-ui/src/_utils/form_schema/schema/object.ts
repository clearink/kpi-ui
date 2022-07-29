import { ObjectShape, MakePartial, FilterSchema } from '../types'
import BaseSchema from './base'

export default class ObjectSchema<T extends ObjectShape> extends BaseSchema<T, MakePartial<T>> {
  public readonly shape!: T

  constructor(shape: T) {
    // TODO: 待优化 仅支持 plain object
    super('object', (input): input is any => {
      return typeof input === 'object' && input !== null
    })
    this.shape = shape
  }

  static create<S extends ObjectShape = {}>(shape: S) {
    return new ObjectSchema<FilterSchema<S>>(shape as any)
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
}
