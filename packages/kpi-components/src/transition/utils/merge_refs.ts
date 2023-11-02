import type { Ref } from 'react'
import { isFunction, isNullish } from '@kpi-ui/utils'

export default function mergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return (el: T | null) => {
    for (let i = 0; i < refs.length; i++) {
      const ref = refs[i]
      if (isFunction(ref)) ref(el)
      // eslint-disable-next-line no-param-reassign
      else if (!isNullish(ref)) (ref as any).current = el
    }
  }
}
