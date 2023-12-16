import { CSSProperties, ReactNode } from 'react'

export interface DividerProps {
  children?: ReactNode
  className?: string
  dashed?: boolean
  align?: 'left' | 'right' | 'center'
  margin?: string | number
  plain?: boolean
  style?: CSSProperties
  direction?: 'horizontal' | 'vertical'
}
