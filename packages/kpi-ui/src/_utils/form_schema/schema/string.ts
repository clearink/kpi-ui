/* eslint-disable class-methods-use-this */
import { isNullish, isString } from '../../is'
import BaseSchema from './base'
import { string as locale } from '../locales/default'
import { Message } from '../interface'
import { makeRule } from '../shared/make_rule'
import { MayBe } from '../../../_types'

export default class StringSchema<T extends string | undefined> extends BaseSchema<T> {
  static create<S extends string | undefined>() {
    return new StringSchema<S>()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */
  protected isType(value: MayBe<string>) {
    return isString(value)
  }

  _validate() {
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
    // TODO: 待复制
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
    const handler = (value: MayBe<string>) => (isNullish(value) ? value : value.trim())
    // 避免别的 transform 改变后造成 trimHandler 失效
    const rule = (value: string) => value === value.trim()
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
