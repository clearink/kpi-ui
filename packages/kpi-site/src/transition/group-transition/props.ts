import { CSSTransitionProps } from '../css-transition/props'

export interface GroupTransitionProps<E extends HTMLElement = HTMLElement>
  extends Omit<CSSTransitionProps<E>, 'when' | 'unmountOnExit' | 'children'> {
  children: JSX.Element[]
}
