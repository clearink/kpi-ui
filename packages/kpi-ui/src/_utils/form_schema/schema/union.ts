import { NonUndefined, MayBe, ArrayInner, UnionInput, UnionOutput } from '../types'
import { Schema } from '../types/schema'
import BaseSchema from './base'

export default class UnionSchema<
  T extends MayBe<UnionInput> = UnionInput | undefined
> extends BaseSchema<T, UnionOutput<T>> {
  public readonly inner?: Schema<ArrayInner<T>>

  constructor(inner?: Schema<ArrayInner<T>>) {
    super('object', (input): input is NonNullable<T> => {
      return Array.isArray(input)
    })
    this.inner = inner
  }

  static create<U extends UnionInput = UnionInput>(inner: Readonly<U>) {
    return new UnionSchema<U | undefined>(inner as any)
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

  public required(): UnionSchema<NonUndefined<T>> {
    return super.required()
  }

  public optional(): UnionSchema<T | undefined> {
    return super.optional()
  }

  public nullable(): UnionSchema<T | null> {
    return super.nullable()
  }

  public nullish() {
    return this.optional().nullable()
  }
}
