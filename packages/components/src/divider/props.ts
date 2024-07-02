import type { SemanticStyledProps } from '@kpi-ui/types'
import type { ReactNode } from 'react'

export interface DividerProps extends SemanticStyledProps<'root' | 'text'> {
  align?: 'center' | 'left' | 'right'
  children?: ReactNode
  dashed?: boolean
  direction?: 'horizontal' | 'vertical'
  margin?: number | string
  plain?: boolean
}
