import { isValidElement, type ReactElement, type ReactNode, type Ref } from 'react'
import { isFragment, isMemo } from 'react-is'
import { isFunction, isNullish } from './is'

export function fillRef<T>(el: T, ref?: Ref<T>) {
  if (isFunction(ref)) ref(el)
  else if (!isNullish(ref)) (ref as any).current = el
}

export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  if (refs.length <= 1) return refs[0]

  return (el: T | null) => {
    refs.forEach((ref) => fillRef(el, ref))
  }
}

export function supportRef(el: ReactNode): el is ReactElement {
  if (isFragment(el) || !isValidElement(el)) return false

  const type = isMemo(el) ? el.type.type : el.type

  if (isFunction(type) && !type.prototype?.render) return false

  return true
}
