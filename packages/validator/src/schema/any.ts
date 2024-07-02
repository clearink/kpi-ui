import { Valid } from '../make_rule'
import BaseSchema from './base'

export default class AnySchema<T = any> extends BaseSchema<T> {
  static create<T = any>() {
    return new AnySchema<T>()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  _validate(value: T) {
    return Valid(value)
  }
}
