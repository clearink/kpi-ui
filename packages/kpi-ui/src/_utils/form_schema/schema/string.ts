/* eslint-disable class-methods-use-this */
import { isNullish, isString } from '../../is'
import { ValidateInput } from '../schema'
import BaseSchema from './base'
import { string as locale } from '../locales/default'
import { Message } from '../interface'
import { makeRule } from '../shared'
import { MayBe } from '../../../_types'

export default class StringSchema<T extends string | undefined> extends BaseSchema<T> {
  static create<S extends string | undefined>() {
    return new StringSchema<S>()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */
  public isType(value: any) {
    return isString(value)
  }

  public _validate(input: ValidateInput) {
    // TODO
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  min(min: number, message: Message = locale.min) {
    const rule = (value: string) => value.length >= min
    return this._refine('min', makeRule(rule, message, { min }))
  }

  max(max: number, message: Message = locale.max) {
    const rule = (value: string) => value.length <= max
    return this._refine('max', makeRule(rule, message, { max }))
  }

  length(length: number, message: Message = locale.length) {
    const rule = (value: string) => value.length === length
    return this._refine('length', makeRule(rule, message, { length }))
  }

  // regex email url uuid 都是需要用 正则验证的
  // 而且他们好像也是互斥的,那么能否被覆盖呢?
  regex(regex: RegExp, message: Message = locale.regex) {
    const rule = (value: string) => regex.test(value)
    return this._refine('regex', makeRule(rule, message, { regex }))
  }

  email(message: Message = locale.email) {
    // TODO: 待复制
    const regex = /email/
    const rule = (value: string) => regex.test(value)
    return this._refine('email', makeRule(rule, message))
  }

  url(message: Message = locale.url) {
    const regex = /url/
    const rule = (value: string) => regex.test(value)
    return this._refine('url', makeRule(rule, message))
  }

  uuid(message: Message = locale.uuid) {
    const regex = /uuid/
    const rule = (value: string) => regex.test(value)
    return this._refine('uuid', makeRule(rule, message))
  }

  trim(message: Message = locale.trim) {
    // TODO: 继续理清相关逻辑
    const handler = (value: MayBe<string>) => (isNullish(value) ? value : value.trim())
    const rule = (value: MayBe<string>) => isNullish(value) || value === value.trim()
    return this.transform(handler)._refine('trim', makeRule(rule, message))
  }

  lowercase(message: Message = locale.lowercase) {
    const rule = (value: string) => value === value.toLowerCase()
    return this._refine('lowercase', makeRule(rule, message))
  }

  uppercase(message: Message = locale.uppercase) {
    const rule = (value: string) => value === value.toUpperCase()
    return this._refine('uppercase', makeRule(rule, message))
  }
}
