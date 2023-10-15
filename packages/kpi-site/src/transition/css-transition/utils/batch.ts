import { isFunction } from '@kpi/shared'

export default function batch(...funcs: (Function | undefined | null)[]) {
  const filtered = funcs.filter(isFunction)

  return function chained(this: any, ...args: any) {
    filtered.forEach((fn) => fn.apply(this, args))
  }
}
