import type { ReactElement } from 'react'
import type { CSSTransitionProps } from '../CSSTransition/props'

export type SwitchMode = 'out-in' | 'in-out' | 'default'
export interface SwitchTransitionProps {
  mode?: SwitchMode
  children?: ReactElement<CSSTransitionProps>
}
