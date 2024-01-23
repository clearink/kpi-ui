import { isValidElement, Component } from 'react'
import { isFragment, isMemo } from 'react-is'
import { isFunction, isNullish } from '../is'
// types
import type { ReactRef } from '@kpi-ui/types'
import type { ReactElement, ReactNode } from 'react'

export function fillRef<T>(el: T, ref?: ReactRef<T>) {
  if (isFunction(ref)) ref(el)
  else if (!isNullish(ref)) (ref as any).current = el
}

export function mergeRefs<T>(...refs: (ReactRef<T> | undefined)[]) {
  return (el: T | null) => {
    refs.forEach((ref) => fillRef(el, ref))
  }
}

export function supportRef(el: ReactNode): el is ReactElement & { ref: ReactRef<any> } {
  if (isFragment(el) || !isValidElement(el)) return false

  const type = isMemo(el) ? el.type.type : el.type

  if (isFunction(type) && !(type instanceof Component)) return false

  return true
}
