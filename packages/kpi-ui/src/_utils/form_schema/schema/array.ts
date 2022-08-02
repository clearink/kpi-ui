import { ArrayInner, MakeInnerType } from '../types'
import { InputValue, Invalid, toRawType, Valid, ValidateReturnType } from '../utils'
import BaseSchema from './base'

export default class ArraySchema<T extends any[]> extends BaseSchema<MakeInnerType<T>, T> {
  constructor(private readonly innerType: BaseSchema<ArrayInner<T>>) {
    super()
  }

  static create<I extends BaseSchema>(innerType: I) {
    return new ArraySchema<I[]>(innerType as any)
  }

  /** =============================== */
  /** ==========  Validate  ========= */
  /** =============================== */
  // eslint-disable-next-line class-methods-use-this
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
