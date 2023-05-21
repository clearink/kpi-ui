import { isFunction } from '@kpi/shared'

export default function chainedFunc<Args extends any[], This>(
  ...funcs: ((this: This, ...args: Args) => any)[]
) {
  return function chained(this: This, ...args: Args) {
    funcs.forEach((fn) => isFunction(fn) && fn.apply(this, args))
  }
}
