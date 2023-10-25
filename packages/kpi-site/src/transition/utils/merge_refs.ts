import { isFunction, isObject } from '@kpi/shared'
import type { Ref } from 'react'

export default function mergeRefs<T>(...refs: Ref<T>[]) {
  return (el: T | null) => {
    for (let i = 0; i < refs.length; i++) {
      const ref = refs[i]
      if (isFunction(ref)) ref(el)
      else if (isObject(ref)) (ref as any).current = el
    }
  }
}
