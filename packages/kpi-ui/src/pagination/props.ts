import { CSSProperties } from 'react'

export interface PaginationProps {
  className?: string
  style?: CSSProperties
  current?: number
  defaultCurrent?: number
  defaultPageSize?: number
  disabled?: boolean
  hideOnSingle?: boolean
  total?: number
}
