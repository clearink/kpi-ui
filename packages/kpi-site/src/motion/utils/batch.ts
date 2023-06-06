import { isFunction } from '@kpi/shared'

export default function batch<A extends any[], T>(...funcs: ((this: T, ...args: A) => any)[]) {
  return function chained(this: T, ...args: A) {
    funcs.forEach((fn) => isFunction(fn) && fn.apply(this, args))
  }
}
