import type { SemanticStyledProps } from '@kpi-ui/types'
import type { ReactNode } from 'react'

export interface CheckboxGroupProps extends SemanticStyledProps<'root' | 'text'> {
  children?: ReactNode
}
