import type { CSSProperties, ReactNode } from 'react'

export interface BadgeProps {
  color?: string
  count?: ReactNode
  dot?: boolean
  offset?: [number, number]
  maxCount?: number
  hidden?: boolean
  size?: 'default' | 'small'
  status?: 'success' | 'processing' | 'default' | 'error' | 'warning'
  text?: ReactNode
  title?: ReactNode
  style?: CSSProperties
  className?: string
  children?: ReactNode
}
