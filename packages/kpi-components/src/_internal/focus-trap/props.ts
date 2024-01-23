// types
import type { SemanticStyledProps } from '@kpi-ui/types'
import type React from 'react'

export interface FocusTrapProps extends SemanticStyledProps<'root'> {
  children: React.ReactElement

  open?: boolean

  getTabbable?: (el: HTMLElement) => HTMLElement[]
}
