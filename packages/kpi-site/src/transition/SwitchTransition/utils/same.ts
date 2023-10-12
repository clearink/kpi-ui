import { isNullish } from '@kpi/shared'
import { isValidElement, ReactNode } from 'react'

export default function isSameElement(current: ReactNode, next: ReactNode) {
  if (current === next) return true

  return (
    isValidElement(current) &&
    isValidElement(next) &&
    !isNullish(current.key) &&
    current.key === next.key
  )
}
