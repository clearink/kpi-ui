import { RuleMessage } from '../types/schema'
import BaseSchema from './base'

export default class StringSchema extends BaseSchema<string> {
  constructor() {
    super('string')
  }

  min(len: number, message?: RuleMessage) {
    return this.test((value) => {
      if (value.length < len) {
        throw new Error(`最小长度为${len}`)
      }
      return true
    })
  }
  static create() {
    return new StringSchema()
  }
}
