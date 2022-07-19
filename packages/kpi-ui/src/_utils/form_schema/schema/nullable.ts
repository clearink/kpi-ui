import { RuleMessage } from '../types/schema'
import BaseSchema from './base'

export default class NullableSchema<T extends unknown> extends BaseSchema<T | null> {
  private readonly inner!: BaseSchema<T>

  constructor(inner: BaseSchema<T>, message?: RuleMessage) {
    super('nullable')
    this.inner = inner
  }

  unwrap() {
    return this.inner
  }

  static create<T extends BaseSchema<any>>(inner: T, message?: RuleMessage) {
    return new NullableSchema(inner, message)
  }

  public async validate(input?: any): Promise<boolean> {
    if (input === null) {
      return true
    }
    return this.inner.validate(input)
  }
}
