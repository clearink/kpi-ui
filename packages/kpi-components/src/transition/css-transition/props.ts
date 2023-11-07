import type { ReactElement } from 'react'
import type { TransitionStore } from './hooks/use_transition_store'

export type TransitionStep = 'enter' | 'appear' | 'exit'
export type TransitionStatus = 'enter' | 'exit' | 'entered' | 'exited'

export type CSSTransitionRef<E extends HTMLElement = HTMLElement> = TransitionStore<E>
export interface CSSTransitionProps<E extends HTMLElement = HTMLElement> {
  ssr?: boolean
  when?: boolean
  name?: string
  type?: 'transition' | 'animation'
  duration?: number | { appear?: number; enter?: number; exit?: number }
  appear?: boolean
  mountOnEnter?: boolean
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
