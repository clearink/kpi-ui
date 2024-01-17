import type { SemanticStyledProps, StyledProps } from '@kpi-ui/types'
import type { ReactNode } from 'react'

export interface CheckboxGroupProps extends StyledProps, SemanticStyledProps<'root' | 'text'> {
  children?: ReactNode
}
