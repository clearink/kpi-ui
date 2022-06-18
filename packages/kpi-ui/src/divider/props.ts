import { CSSProperties, ReactNode } from 'react'

export interface DividerProps {
  children?: ReactNode
  className?: string
  dashed: boolean
  orientation: 'left' | 'right' | 'center'
  orientationMargin?: string | number
  plain: boolean
  style?: CSSProperties
  type: 'horizontal' | 'vertical'
}
