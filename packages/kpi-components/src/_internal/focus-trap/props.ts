// types
import type { SemanticStyledProps } from '@kpi-ui/types'
import type React from 'react'

export interface FocusTrapProps extends SemanticStyledProps<'root'> {
  children: React.ReactElement

  active?: boolean

  getTabbable?: (container: HTMLElement) => HTMLElement[]

  onEnter?: () => void

  onExit?: (focusNode: Element | null) => void
}
