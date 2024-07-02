import type { CSSProperties, ComponentType, ReactElement } from 'react'

import type { CSSTransitionProps } from '../css-transition/props'

export interface GroupTransitionProps<E extends HTMLElement = HTMLElement>
  extends Omit<CSSTransitionProps<E>, 'children' | 'unmountOnExit' | 'when'> {
  [key: string]: any

  children: ReactElement[]

  className?: string

  flip?: boolean

  onExitComplete?: () => void

  style?: CSSProperties

  tag?: ComponentType | keyof HTMLElementTagNameMap
}
