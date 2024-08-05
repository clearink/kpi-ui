import type { SemanticStyledProps } from '@comps/_shared/types'
import type { ReactElement } from 'react'

import defaultGetTabbable from './utils/tabbable'

export interface FocusTrapProps extends SemanticStyledProps<'root'> {
  active?: boolean

  children: ReactElement

  getTabbable?: (container: HTMLElement) => HTMLElement[]

  onEnter?: () => void

  onExit?: (returnTo: Element | null) => void
}

/**
 * |---------------------------------------------------------|
 * |---------------------------------------------------------|
 * |                      default props                      |
 * |---------------------------------------------------------|
 * |---------------------------------------------------------|
 */

export const defaultFocusTrapProps: Partial<FocusTrapProps> = {
  getTabbable: defaultGetTabbable,
}
