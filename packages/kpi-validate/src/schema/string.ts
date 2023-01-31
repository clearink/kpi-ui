import { isNullish, isString, isUndefined } from '@kpi/shared'
import BaseSchema from './base'
import EffectSchema from './effect'
import { base, string } from '../locales/default'
import { Invalid, makeRule, Valid } from '../make_rule'
import * as REGEX from '../utils/regex'

import type { Context, Message } from '../interface'

export default class StringSchema extends BaseSchema<string | undefined> {
  static create(message: Message = string.invalid) {
    return new StringSchema(message)
  }

  constructor(private message: Message = string.invalid) {
    super()
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  _validate(value: string | undefined, context: Context) {
    if (isUndefined(value) || value === '') return Valid(value)

    if (!isString(value)) return Invalid(context)(this.message, { value })

    return super._validate(value, context)
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  required(message: Message = base.required): EffectSchema<this, string> {
    const rule = (value: any) => !(isNullish(value) || value === '')
    return EffectSchema.required(this, makeRule(rule, message)) as any
  }

  min(min: number, message: Message = string.min) {
    const rule = (value: string) => value.length >= min
    return this._refine('min', makeRule(rule, message, { min }))
  }

  max(max: number, message: Message = string.max) {
    const rule = (value: string) => value.length <= max
    return this._refine('min', makeRule(rule, message, { max }))
  }

  length(length: number, message: Message = string.length) {
    const rule = (value: string) => value.length === length
    return this._refine('length', makeRule(rule, message, { length }))
  }

  range(min: number, max: number, message: Message = string.range) {
    const rule = (value: string) => value.length >= min && value.length <= max
    return this._refine('range', makeRule(rule, message, { min, max }))
  }

  regex(regex: RegExp, message: Message = string.regex) {
    const rule = (value: string) => regex.test(value)
    return this._refine('regex', makeRule(rule, message, { regex }))
  }

  email(message: Message = string.email) {
    const rule = (value: string) => REGEX.email.test(value)
    return this._refine('email', makeRule(rule, message))
  }

  url(message: Message = string.url) {
    const rule = (value: string) => REGEX.url.test(value)
    return this._refine('url', makeRule(rule, message))
  }

  uuid(message: Message = string.uuid) {
    const rule = (value: string) => REGEX.uuid.test(value)
    return this._refine('uuid', makeRule(rule, message))
  }

  lowercase(message: Message = string.lowercase) {
    const rule = (value: string) => value === value.toLowerCase()
    return this._refine('lowercase', makeRule(rule, message))
  }

  uppercase(message: Message = string.uppercase) {
    const rule = (value: string) => value === value.toUpperCase()
    return this._refine('uppercase', makeRule(rule, message))
  }
}
