// types
import type { ReactElement } from 'react'
import type { APPEAR, ENTER, ENTERED, EXIT, EXITED } from '../../constants'

export type TransitionStep = typeof APPEAR | typeof ENTER | typeof EXIT

export type TransitionStatus =
  | typeof APPEAR
  | typeof ENTER
  | typeof EXIT
  | typeof ENTERED
  | typeof EXITED

export type CSSTransitionRef<E extends HTMLElement = HTMLElement> = {
  instance: E | null
  status: TransitionStatus
}

export interface CSSTransitionProps<E extends HTMLElement = HTMLElement> {
  when?: boolean
  name?: string
  type?: 'transition' | 'animation'
  duration?: number | { appear?: number; enter?: number; exit?: number }
  appear?: boolean

  /**
   * @zh 进入过渡时才进行初次渲染
   * @default false
   */
  mountOnEnter?: boolean

  /**
   * @zh 退出过渡结束时卸载元素
   * @default false
   */
  unmountOnExit?: boolean
  children: ReactElement
  // classNames
  classNames?: {
    appear?: string
    appearActive?: string
    appearTo?: string
    enter?: string
    enterActive?: string
    enterTo?: string
    exit?: string
    exitActive?: string
    exitTo?: string
  }
  // 自定义结束事件，会在 onEntering 与 onExiting 时多次调用
  addEndListener?: (el: E, step: TransitionStep, done: () => void) => void | (() => void)
  // events
  onEnter?: (el: E, appearing: boolean) => void
  onEntering?: (el: E, appearing: boolean) => void
  onEntered?: (el: E, appearing: boolean) => void
  onEnterCancel?: (el: E, appearing: boolean) => void
  onExit?: (el: E) => void
  onExiting?: (el: E) => void
  onExited?: (el: E) => void
  onExitCancel?: (el: E) => void
}
