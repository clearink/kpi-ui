import { isFunction } from '@kpi/shared'

export default function batch<A extends any[], T>(...funcs: ((this: T, ...args: A) => any)[]) {
  const fns = funcs.filter(isFunction)

  return function chained(this: T, ...args: A) {
    fns.forEach((fn) => fn.apply(this, args))
  }
}
