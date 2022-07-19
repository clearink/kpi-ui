import { SchemaRule } from '../types/schema'

export default abstract class BaseSchema<T extends unknown> {
  // 存储校验函数
  readonly _type!: T
  private readonly rules: SchemaRule<T>[] = []
  static create() {}
  public constructor(type: string) {
    this._type = type as T
  }
  protected test(tester: SchemaRule<T>) {
    this.rules.push(tester)
    return this
  }
  public validate(input?: T | null) {
    const entry = <T>input
  }
}
