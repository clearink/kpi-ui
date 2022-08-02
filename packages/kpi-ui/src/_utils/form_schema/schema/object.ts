/* eslint-disable class-methods-use-this */
import { ObjectShape, MakePartial, FilterSchema } from '../types'
import { InputValue, Invalid, toRawType, Valid, ValidateReturnType } from '../utils'
import BaseSchema from './base'

export default class ObjectSchema<T extends ObjectShape> extends BaseSchema<MakePartial<T>, T> {
  constructor(public readonly innerType: T) {
    super()
  }

  static create<S extends ObjectShape = {}>(innerType: S) {
    return new ObjectSchema<FilterSchema<S>>(innerType as any)
  }

  /** =============================== */
  /** ==========  Validate  ========= */
  /** =============================== */

  private isType(input: InputValue) {
    return toRawType(input.value) === 'object'
  }

  public _validate(input: InputValue): ValidateReturnType<this['_Out']> {
    if (!this.isType(input)) return Invalid
    return Valid(input.value)
  }

  /** =============================== */
  /** ==========  Feature  ========== */
  /** =============================== */

  private get shape() {
    return this.innerType
  }
}
