import { type ReactElement, type ReactNode, isValidElement } from 'react'

export function isElementEqual(current: ReactNode, next: ReactNode) {
  if (current === next) return true

  if (!isValidElement(current) || !isValidElement(next)) return false

  return current.key === next.key && current.type === next.type
}

export function isElementsEqual(prev: ReactElement[], next: ReactElement[]) {
  if (prev.length !== next.length) return false

  return prev.every((el, i) => isElementEqual(el, next[i]))
}
