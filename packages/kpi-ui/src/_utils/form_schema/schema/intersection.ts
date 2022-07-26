import { NonUndefined, MayBe, ArrayInner, IntersectionInput, IntersectionOutput } from '../types'
import { Schema } from '../types/schema'
import BaseSchema from './base'

export default class IntersectionSchema<
  T extends MayBe<IntersectionInput> = IntersectionInput | undefined
> extends BaseSchema<T, IntersectionOutput<[...NonNullable<T>]>> {
  public readonly inner?: Schema<ArrayInner<T>>

  constructor(inner?: Schema<ArrayInner<T>>) {
    super('object', (input): input is NonNullable<T> => {
      return Array.isArray(input)
    })
    this.inner = inner
  }

  static create<U extends IntersectionInput = IntersectionInput>(inner: Readonly<U>) {
    return new IntersectionSchema<U | undefined>(inner as any)
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

  public required(): IntersectionSchema<NonUndefined<T>> {
    return super.required()
  }

  public optional(): IntersectionSchema<T | undefined> {
    return super.optional()
  }

  public nullable(): IntersectionSchema<T | null> {
    return super.nullable()
  }

  public nullish() {
    return this.optional().nullable()
  }
}
