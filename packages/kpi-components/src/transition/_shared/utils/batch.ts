import { isFunction } from '@kpi-ui/utils'

import type { AnyFunction, MayBe } from '../../../types'

export default function batch<T extends MayBe<AnyFunction>>(...funcs: T[]) {
  const filtered = funcs.filter(isFunction) as AnyFunction[]

  return function batched(this: any, ...args: any[]) {
    filtered.forEach((fn) => fn.apply(this, args))
  } as T
}
