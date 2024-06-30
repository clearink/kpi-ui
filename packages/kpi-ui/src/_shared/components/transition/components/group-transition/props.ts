import type { CSSProperties, ComponentType, ReactElement } from 'react'
import type { CSSTransitionProps } from '../css-transition/props'

export interface GroupTransitionProps<E extends HTMLElement = HTMLElement>
  extends Omit<CSSTransitionProps<E>, 'when' | 'unmountOnExit' | 'children'> {
  children: ReactElement[]

  tag?: keyof HTMLElementTagNameMap | ComponentType

  onExitComplete?: () => void

  flip?: boolean

  style?: CSSProperties

  className?: string

  [key: string]: any
}
