/* eslint-disable class-methods-use-this */
import BaseSchema from './base'
import { MayBe, Writable } from '../../../_types'
import { isNullish } from '../..'

export type EnumItem = string | number | symbol | boolean
export type EnumInput = Readonly<[EnumItem, ...EnumItem[]]>

// 感觉可以合并到 string 里面去
export class EnumSchema<T extends EnumInput> extends BaseSchema<T[number], T> {
  constructor(private readonly innerType: T) {
    super()
  }

  static create<U extends EnumItem, E extends Readonly<[U, ...U[]]>>(
    enums: E
  ): EnumSchema<Writable<E>>
  static create<U extends EnumItem, E extends [U, ...U[]]>(enums: E) {
    return new EnumSchema<E>(enums)
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  isType(value: MayBe<T[number]>) {
    return !isNullish(value) && this.innerType.includes(value)
  }

  _validate() {
    // TODO
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  private get enum() {
    return this.innerType
  }
}
