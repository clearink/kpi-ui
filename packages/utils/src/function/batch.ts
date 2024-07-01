// types
import type { AnyFn, MayBe } from '@kpi-ui/types'

import { isFunction } from '../is'

export function batch<T extends AnyFn>(...funcs: MayBe<T>[]) {
  const filtered = funcs.filter(isFunction).reverse() as T[]

  return function batched(this: any, ...args: any[]) {
    const callbacks = filtered.map((fn) => fn.apply(this, args)).filter(isFunction)

    if (!callbacks.length) return

    // prettier-ignore
    return () => { callbacks.forEach((fn) => { fn() }) }
  } as T
}
