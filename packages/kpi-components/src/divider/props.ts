import { SemanticStyledProps, StyledProps } from '@kpi-ui/types'
import { ReactNode } from 'react'

export interface DividerProps extends StyledProps, SemanticStyledProps<'root' | 'text'> {
  children?: ReactNode
  dashed?: boolean
  align?: 'left' | 'right' | 'center'
  margin?: string | number
  plain?: boolean
  direction?: 'horizontal' | 'vertical'
}
