import { isFunction } from '@kpi-ui/utils'

export default function batch(...funcs: (Function | undefined | null)[]) {
  const filtered = funcs.filter(isFunction)

  return function batched(this: any, ...args: any) {
    filtered.forEach((fn) => fn.apply(this, args))
  }
}
