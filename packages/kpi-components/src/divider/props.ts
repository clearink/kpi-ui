import type { SemanticStyledProps } from '@kpi-ui/types'
import type { ReactNode } from 'react'

export interface DividerProps extends SemanticStyledProps<'root' | 'text'> {
  children?: ReactNode
  dashed?: boolean
  align?: 'left' | 'right' | 'center'
  margin?: string | number
  plain?: boolean
  direction?: 'horizontal' | 'vertical'
}
