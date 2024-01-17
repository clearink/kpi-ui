import { isUndefined } from '@kpi-ui/utils'
import { enums } from '../locales/default'
import { Invalid, Valid } from '../make_rule'
import BaseSchema from './base'

import type { Writable } from '@kpi-ui/types'
import type { Context } from '../interface'
export type EnumItem = string | number | symbol | boolean
export type EnumInput = Readonly<[EnumItem, ...EnumItem[]]>

/** schema =================================================================== */

export default class EnumSchema<T extends EnumInput> extends BaseSchema<T[number] | undefined> {
  constructor(private readonly inner: T) {
    super()
  }

  static create<U extends EnumItem, E extends Readonly<[U, ...U[]]>>(
    inner: E
  ): EnumSchema<Writable<E>>
  static create<U extends EnumItem, E extends [U, ...U[]]>(inner: E) {
    return new EnumSchema<E>(inner)
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  _validate(value: T[number] | undefined, context: Context) {
    if (isUndefined(value)) return Valid(value)

    if (!this.inner.includes(value)) {
      return Invalid(context)(enums.invalid, { enums: this.inner, value })
    }
    return super._validate(value, context)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  get enum() {
    return this.inner
  }
}
