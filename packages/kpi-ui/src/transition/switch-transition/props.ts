import type { CSSTransitionProps } from '../css-transition/props'

export type SwitchMode = 'out-in' | 'in-out' | 'default'
export interface SwitchTransitionProps<E extends HTMLElement = HTMLElement>
  extends Omit<CSSTransitionProps<E>, 'when' | 'unmountOnExit'> {
  mode?: SwitchMode
}
