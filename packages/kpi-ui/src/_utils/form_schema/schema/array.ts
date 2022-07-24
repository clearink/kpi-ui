import { NonUndefined, MayBe, ArrayInner, MakeInnerType } from '../types'
import { Schema } from '../types/schema'
import BaseSchema from './base'

export default class ArraySchema<T extends MayBe<any[]>> extends BaseSchema<T, MakeInnerType<T>> {
  public readonly inner?: Schema<ArrayInner<T>>

  constructor(inner?: Schema<ArrayInner<T>>) {
    super('object', (input): input is NonNullable<T> => {
      return Array.isArray(input)
    })
    this.inner = inner
  }

  static create<I extends Schema = any>(inner?: I) {
    return new ArraySchema<I[] | undefined>(inner as any)
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

  public required(): ArraySchema<NonUndefined<T>> {
    return super.required()
  }

  public optional(): ArraySchema<T | undefined> {
    return super.optional()
  }

  public nullable(): ArraySchema<T | null> {
    return super.nullable()
  }

  public nullish() {
    return this.optional().nullable()
  }
}
