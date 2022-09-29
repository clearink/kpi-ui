/* eslint-disable class-methods-use-this */
import { isArray } from '../../is'
import BaseSchema from './base'
import { array as locale } from '../locales/default'
import { Message } from '../interface'
import { makeRule } from '../shared/make_rule'
import { MayBe } from '../../../_types'

export type ArrayInner<T> = T extends Array<infer I> ? I : never
export type MakeInnerType<T extends MayBe<any[]>> = T extends Array<infer I>
  ? I extends BaseSchema
    ? I['_Out'][]
    : T
  : T

export class ArraySchema<T extends any> extends BaseSchema<MakeInnerType<T[]>, T[]> {
  constructor(private readonly innerType: BaseSchema<ArrayInner<T[]>>) {
    super()
  }

  static create<I extends BaseSchema>(innerType: I) {
    return new ArraySchema(innerType)
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */
  protected isType(value: MayBe<T[]>) {
    return isArray(value)
  }

  _validate() {
    // TODO
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  get element() {
    return this.innerType
  }

  min(min: number, message: Message = locale.min) {
    const rule = (value: any[]) => value.length >= min
    return this._refine('min', makeRule(rule, message, { min }))
  }

  max(max: number, message: Message = locale.min) {
    const rule = (value: any[]) => value.length <= max
    return this._refine('max', makeRule(rule, message, { max }))
  }

  // min max length 之间的组合不好处理，现有2个方法
  // 1. 三者独立
  // 2. length 不提供自定义message
  // TODO: merge
  length(length: number, message: Message = locale.length) {
    const rule = (value: any[]) => value.length === length
    return this._refine('length', makeRule(rule, message, { length }))
  }

  nonempty(message: Message = locale.nonempty) {
    return this.min(1, message)
  }
}
