// eslint-disable-next-line import/no-cycle
import BaseSchema from './base'

export default class OptionalSchema<T extends unknown> extends BaseSchema<T | undefined> {
  private readonly inner: BaseSchema<T>

  constructor(inner: BaseSchema<T>) {
    super('required')
    this.inner = inner
  }

  unwrap() {
    return this.inner
  }

  static create<S extends unknown>(inner: BaseSchema<S>) {
    return new OptionalSchema(inner)
  }

  public async validate(input?: any): Promise<boolean> {
    if (input === undefined) {
      return true
    }
    return this.inner.validate(input)
  }
}
