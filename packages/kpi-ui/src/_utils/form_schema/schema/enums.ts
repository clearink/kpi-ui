/* eslint-disable class-methods-use-this */
import { NonUndefined, Writable } from '../types'
import { InputValue, toRawType, ValidateReturnType, Invalid, Valid } from '../utils'
import BaseSchema from './base'

type EnumInput = readonly [any, ...any[]] // [any, ...any[]]
export default class EnumSchema<T extends EnumInput> extends BaseSchema<T, T[number]> {
  constructor(private readonly innerType: T) {
    super()
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
  private isType(input: InputValue) {
    return toRawType(input.value) === 'string'
  }

  public _validate(input: InputValue): ValidateReturnType<this['_Out']> {
    if (!this.isType(input)) return Invalid
    return Valid(input.value)
  }

  /** =============================== */
  /** ==========  Feature  ========== */
  /** =============================== */

  private get enum() {
    return this.innerType
  }
}
