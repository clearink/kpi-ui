import { isFunction } from '@kpi-ui/utils'

import type { AnyFn, MayBe } from '@kpi-ui/types'

export default function batch<T extends MayBe<AnyFn>>(...funcs: T[]) {
  const filtered = funcs.filter(isFunction) as AnyFn[]

  return function batched(this: any, ...args: any[]) {
    filtered.forEach((fn) => fn.apply(this, args))
  } as T
}
