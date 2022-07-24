import { NonUndefined, MayBe, ArrayInner, MakeInnerType } from '../types'
import { Schema } from '../types/schema'
import BaseSchema from './base'

export default class OrSchema<T extends MayBe<any[]>> extends BaseSchema<T, MakeInnerType<T>> {
  public readonly inner?: Schema<ArrayInner<T>>

  constructor(inner?: Schema<ArrayInner<T>>) {
    super('object', (input): input is NonNullable<T> => {
      return Array.isArray(input)
    })
    this.inner = inner
  }

  static create<I extends Schema = any>(inner?: I) {
    return new OrSchema<I[] | undefined>(inner as any)
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

  public required(): OrSchema<NonUndefined<T>> {
    return super.required()
  }

  public optional(): OrSchema<T | undefined> {
    return super.optional()
  }

  public nullable(): OrSchema<T | null> {
    return super.nullable()
  }

  public nullish() {
    return this.optional().nullable()
  }
}
