import BaseSchema from './base'
import { InputValue, Invalid, Valid, ValidateReturnType } from '../utils'

export type UnionInput = readonly [BaseSchema, BaseSchema, ...BaseSchema[]]
export type UnionOutput<T extends UnionInput> = T[number]['_Out']

export default class UnionSchema<T extends UnionInput> extends BaseSchema<UnionOutput<T>, T> {
  constructor(public readonly innerType: UnionInput) {
    super()
  }

  static create<U extends UnionInput = UnionInput>(innerType: Readonly<U>) {
    return new UnionSchema<U>(innerType as any)
  }

  /** =============================== */
  /** ==========  Validate  ========= */
  /** =============================== */

  private isType() {
    if (!Array.isArray(this.innerType)) return false
    return this.innerType.every((schema) => schema instanceof BaseSchema)
  }

  public _validate(input: InputValue): ValidateReturnType<this['_Out']> {
    if (!this.isType()) return Invalid
    return Invalid
    // return Promise.all(this.innerType.map((schema) => schema._validate(input.value))).then(
    //   (results) => {
    //     for (const result of results) {
    //       if (result.status === 'valid') {
    //         return Valid(input.value)
    //       }
    //     }
    //     return Invalid
    //   }
    // )
  }

  /** =============================== */
  /** ==========  Feature  ========== */
  /** =============================== */
}
