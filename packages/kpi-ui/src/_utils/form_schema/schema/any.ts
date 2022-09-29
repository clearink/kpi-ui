/* eslint-disable class-methods-use-this */
import { Valid } from '../shared/make_rule'
import BaseSchema from './base'

export default class AnySchema extends BaseSchema {
  static create() {
    return new AnySchema()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  // TODO: ValidateInput 还要优化一下
  public _validate() {
    // TODO
  }
}
