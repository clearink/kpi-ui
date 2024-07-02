import type { CSSTransitionProps } from '../css-transition/props'

export type SwitchMode = 'default' | 'in-out' | 'out-in'
export interface SwitchTransitionProps<E extends HTMLElement = HTMLElement>
  extends Omit<CSSTransitionProps<E>, 'unmountOnExit' | 'when'> {
  mode?: SwitchMode
}
