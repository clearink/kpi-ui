import { RuleMessage } from '../types/schema'
import BaseSchema from './base'

export default class StringSchema extends BaseSchema<string> {
  constructor() {
    super('string')
    super.test((input) => {
      if (input instanceof String) input = input.valueOf()
      return typeof input === 'string'
    })
  }

  min(len: number, message?: RuleMessage) {
    return this.test((value) => value.length > len, message)
  }

  static create() {
    return new StringSchema()
  }

  public async validate(input?: any): Promise<boolean> {
    // 默认可选
    if (input === undefined) return true
    return super.validate(input)
  }
}
