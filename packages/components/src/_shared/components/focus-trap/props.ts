import type { SemanticStyledProps } from '@comps/_shared/types'
import type { ReactElement } from 'react'

export interface FocusTrapProps extends SemanticStyledProps<'root'> {
  active?: boolean

  children: ReactElement

  getTabbable?: (container: HTMLElement) => HTMLElement[]

  onEnter?: () => void

  onExit?: (returnTo: Element | null) => void
}
