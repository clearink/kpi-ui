import { RuleMessage, SchemaRule } from '../types/schema'
// eslint-disable-next-line import/no-cycle
import OptionalSchema from './optional'

export default abstract class BaseSchema<T extends unknown> {
  // eslint-disable-next-line no-underscore-dangle
  readonly _type!: T

  private readonly rules: SchemaRule<T>[] = []

  public constructor(type: string) {
    this._type = type as T
  }

  public optional() {
    return OptionalSchema.create(this)
  }

  // public nullable(message?: RuleMessage) {
  //   return NullableSchema.create(this, message)
  // }

  // public nullish(message?: RuleMessage) {
  //   return this.nullable()
  // }

  protected test(tester: SchemaRule<any>, message?: RuleMessage) {
    this.rules.push(makeRule<T>(tester, message))
    return this
  }

  public async validate(input?: any) {
    for (const rule of this.rules) {
      // eslint-disable-next-line no-await-in-loop
      const res = await rule(<T>input)
      if (!res) throw new Error('error')
    }
    return true
  }
}
function makeRule<T extends any>(rule: SchemaRule<T>, message?: RuleMessage) {
  const $message = typeof message === 'object' ? message : { message }
  return async (input: T) => {
    const res = await rule(input)
    if (!res) throw new Error($message?.message || `invalid data : ${input}`)
    return res
  }
}
