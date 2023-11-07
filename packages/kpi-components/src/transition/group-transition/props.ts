import type { ReactElement } from 'react'
import type { CSSTransitionProps } from '../css-transition/props'

export interface GroupTransitionProps<E extends HTMLElement = HTMLElement>
  extends Omit<CSSTransitionProps<E>, 'when' | 'unmountOnExit' | 'children'> {
  children: ReactElement[]
  tag?: keyof HTMLElementTagNameMap
  onExitComplete?: () => void
  // 开启 FLIP 动画
  flip?: boolean
}
