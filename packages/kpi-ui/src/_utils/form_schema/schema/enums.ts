import { NonUndefined, MayBe, Writable } from '../types'
import BaseSchema from './base'

type EnumInput = readonly [any, ...any[]] // [any, ...any[]]
export default class EnumSchema<T extends EnumInput> extends BaseSchema<T, NonNullable<T>[number]> {
  public readonly enums!: T

  constructor(enums: T) {
    super('enum')
    this.enums = enums
  }

  static create<U extends string, E extends Readonly<[U, ...U[]]>>(
    enums: E
  ): EnumSchema<Writable<E>>
  static create<U extends string, E extends [U, ...U[]]>(enums: E) {
    return new EnumSchema<E>(enums)
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

  public required(): EnumSchema<NonUndefined<T>> {
    return super.required()
  }

  public optional(): EnumSchema<T | undefined> {
    return super.optional()
  }

  public nullable(): EnumSchema<T | null> {
    return super.nullable()
  }

  public nullish() {
    return this.optional().nullable()
  }
}
