import type { RefObject } from 'react'

export interface TransitionProps<E extends HTMLElement = HTMLElement> {
  name: string
  when: boolean
  mountOnEnter?: boolean
  unmountOnExit?: boolean
  type?: 'transition' | 'animation'
  duration?: number | { appear?: number; enter?: number; exit?: number }
  appear?: boolean
  css?: boolean
  mode?: 'in-out' | 'out-in' | 'default'
  children: (ref: RefObject<E>) => JSX.Element
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
  addEndListener?: (el: E, done: () => void) => void
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
