import type { CSSTransitionProps } from '../css-transition/props'

export interface LayoutTransitionProps<E extends HTMLElement = HTMLElement>
  extends Omit<CSSTransitionProps<E>, 'when' | 'unmountOnExit'> {
  /**
   * @zh 唯一id,用于区分元素
   */
  id: string
}
