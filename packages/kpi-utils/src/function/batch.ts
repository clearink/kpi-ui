import { isFunction } from '../is'
// types
import type { AnyFn, MayBe } from '@kpi-ui/types'

export function batch<T extends AnyFn>(...funcs: MayBe<T>[]) {
  const filtered = funcs.filter(isFunction).reverse() as T[]

  return function batched(this: any, ...args: any[]) {
    const cleanups = filtered.map((fn) => fn.apply(this, args)).filter(isFunction)

    if (!cleanups.length) return

    // prettier-ignore
    return () => { cleanups.forEach((fn) => { fn() }) }
  } as T
}
