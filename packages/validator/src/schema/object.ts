import type { Full, MayBe, NonUndefined } from '@internal/types'

import { isObject, isUndefined } from '@internal/utils'

import type { Context } from '../interface'

import SchemaContext from '../context'
import { object } from '../locales/default'
import { Invalid, Valid } from '../make_rule'
import BaseSchema from './base'

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

export type MakePartial<T extends MayBe<ObjectShape>> =
  T extends Record<string, any> ? Full<GroupPartial<T>> : T

/** schema =================================================================== */

export default class ObjectSchema<
  T extends ObjectShape,
  Out = MakePartial<T> | undefined,
> extends BaseSchema<Out> {
  constructor(public readonly inner: T) {
    super()
  }

  static create<S extends ObjectShape>(inner: S) {
    return new ObjectSchema<S>(inner as any)
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  async _validate(value: Out, context: Context) {
    if (isUndefined(value)) return Valid(value)

    if (!isObject(value)) return Invalid(context)(object.invalid, { value })

    const ret = await super._validate(value, context)
    if (ret.status === 'invalid') return ret
    return this._validateInner(value, context)
  }

  async _validateInner(value: Out, context: Context) {
    // 是否要舍弃未指定的key?
    const list = Object.entries(this.shape).map(([key, schema]) => {
      const ctx = SchemaContext.ensure(context, key)
      return schema._validate(value[key], ctx)
    })
    return Promise.all(list).then((results) => {
      for (let i = 0, len = results.length; i < len; i++) {
        const result = results[i][1]
        if (result.status === 'invalid') return result
      }
      // TODO: value 需要改变 因为内部可能会有 transform 改变了原始值
      return Valid(value)
    })
  }

  /** ==================================================== */
  /** feature                                              */
  /** ==================================================== */

  // TODO: 保留不存在的属性
  passthrough() {
    this._remove('strict')
    return this
  }

  // // TODO: 舍弃不存在的属性
  // strict(message: Message = object.unknown) {
  //   // const rule = (value: AnyObj) => true
  //   // 这个params要如何传进去呢? 只能在执行的时候通过context传递了
  //   return this
  // }

  get shape() {
    return this.inner
  }
}
