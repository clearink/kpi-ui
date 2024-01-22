import { isValidElement, Component } from 'react'
import { isFragment, isMemo } from 'react-is'
import { isFunction, isNullish } from './is'
// types
import type { ReactElement, ReactNode, Ref } from 'react'

export function fillRef<T>(el: T, ref?: Ref<T>) {
  if (isFunction(ref)) ref(el)
  else if (!isNullish(ref)) (ref as any).current = el
}

export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return (el: T | null) => {
    refs.forEach((ref) => fillRef(el, ref))
  }
}

export function supportRef(el: ReactNode): el is ReactElement & { ref: Ref<any> } {
  if (isFragment(el) || !isValidElement(el)) return false

  const type = isMemo(el) ? el.type.type : el.type

  if (isFunction(type) && !(type instanceof Component)) return false

  return true
}
