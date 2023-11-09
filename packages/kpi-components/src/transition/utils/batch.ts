import { isFunction } from '@kpi-ui/utils'

import type { AnyFunction, MayBe } from '../../types'

export default function batch(...funcs: MayBe<AnyFunction>[]) {
  const filtered = funcs.filter(isFunction)

  return function batched(this: any, ...args: any) {
    filtered.forEach((fn) => fn.apply(this, args))
  }
}
