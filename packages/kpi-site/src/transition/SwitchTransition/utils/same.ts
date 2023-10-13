import { isValidElement, ReactNode } from 'react'

export default function isSameElement(current: ReactNode, next: ReactNode) {
  if (current === next) return true

  if (!isValidElement(current) || !isValidElement(next)) return false

  return current.key === next.key
}
