/* eslint-disable class-methods-use-this */
import { isObject } from '../../is'
import BaseSchema from './base'
import { object as locale } from '../locales/default'
import { Message } from '../interface'
import { makeRule } from '../shared/make_rule'
import { AnyObject, Full, MayBe, NonUndefined } from '../../../_types'

// 待优化
export type ObjectShape = Record<string, BaseSchema>

export type OptionalKeys<T extends ObjectShape> = {
  [K in keyof T]: undefined extends T[K]['_In'] ? K : never
}[keyof T]

export type RequiredKeys<T extends ObjectShape> = Exclude<keyof T, OptionalKeys<T>>

export type GroupPartial<T extends ObjectShape> = {
  [P in OptionalKeys<T>]?: NonUndefined<T[P]['_Out']>
} & {
  [P in RequiredKeys<T>]: NonUndefined<T[P]['_Out']>
}

export type MakePartial<T extends MayBe<ObjectShape>> = T extends AnyObject
  ? Full<GroupPartial<T>>
  : T

export default class ObjectSchema<T extends ObjectShape> extends BaseSchema<MakePartial<T>, T> {
  constructor(public readonly innerType: T) {
    super()
  }

  static create<S extends ObjectShape = {}>(innerType: S) {
    return new ObjectSchema<S>(innerType as any)
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  protected isType(value: MayBe<MakePartial<T>>) {
    return isObject(value)
  }

  _validate() {
    // TODO
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  get shape() {
    return this.innerType
  }

  strict(message: Message = locale.unknown) {
    const rule = (value: AnyObject) => true
    // 这个params要如何传进去呢? 只能在执行的时候通过context传递了
    return this._refine('strict', makeRule(rule, message, { unknown: '13' }))
  }

  passthrough() {
    this.remove('strict')
    return this
  }
}
