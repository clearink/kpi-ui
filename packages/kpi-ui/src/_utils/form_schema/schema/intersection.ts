/* eslint-disable class-methods-use-this */
import { NonUndefined, MayBe, ArrayInner } from '../types'
import { FullType } from '../types/schema'
import { InputValue, toRawType, ValidateReturnType, Invalid, Valid } from '../utils'
import BaseSchema from './base'

export type IntersectionInput = readonly [BaseSchema, BaseSchema, ...BaseSchema[]]
export type IntersectionOutput<T extends BaseSchema[]> = FullType<
  T extends [infer I, ...infer RI]
    ? I extends BaseSchema
      ? I['_Out'] & (RI extends [BaseSchema, ...BaseSchema[]] ? IntersectionOutput<RI> : unknown)
      : never
    : never
>

export default class IntersectionSchema<T extends IntersectionInput> extends BaseSchema<
  IntersectionOutput<[...T]>,
  T
> {
  constructor(public readonly innerType: BaseSchema<ArrayInner<T>>) {
    super()
  }

  static create<U extends IntersectionInput = IntersectionInput>(inner: Readonly<U>) {
    return new IntersectionSchema<U>(inner as any)
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
}
