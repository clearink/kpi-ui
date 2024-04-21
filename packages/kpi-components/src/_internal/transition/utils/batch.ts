import { isFunction } from '@kpi-ui/utils'
// types
import type { AnyFn, MayBe } from '@kpi-ui/types'

export default function batch<T extends AnyFn>(...funcs: MayBe<T>[]) {
  const filtered = funcs.filter(isFunction) as T[]

  return function batched(this: any, ...args: any[]) {
    // prettier-ignore
    filtered.forEach((fn) => { fn.apply(this, args) })
  } as T
}
