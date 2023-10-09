/* eslint-disable react/no-unused-prop-types */
import { type RefObject, useRef } from 'react'
import useStableCounter from './hooks/useTransitionStore'
import useTransitionEffect from './hooks/useTransitionEffect'
import useTransitionEvent from './hooks/useTransitionEvent'
import formatClassNames from './utils/format'

export interface TransitionProps<El extends HTMLElement = HTMLElement> {
  name: string
  when: boolean
  mountOnEnter?: boolean
  unmountOnExit?: boolean
  type?: 'transition' | 'animation'
  duration?: number | { appear?: number; enter?: number; exit?: number }
  appear?: boolean
  css?: boolean
  mode?: 'in-out' | 'out-in' | 'default'
  children: (ref: RefObject<El>) => JSX.Element
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
  // events
  onEnter?: (el: El, appearing: boolean) => void
  onEntering?: (el: El, done: () => void, appearing: boolean) => void
  onEntered?: (el: El, appearing: boolean) => void
  onEnterCancel?: (el: El, appearing: boolean) => void
  onExit?: (el: El) => void
  onExiting?: (el: El, done: () => void) => void
  onExited?: (el: El) => void
  onExitCancel?: (el: El) => void
}

export default function Transition<El extends HTMLElement = HTMLElement>(
  props: TransitionProps<El>
) {
  const { children } = props

  const ref = useRef<El>(null)

  const counter = useStableCounter(0)

  const classNames = formatClassNames(props.name, props.classNames)

  useTransitionEffect(ref, counter, classNames, props)

  useTransitionEvent(ref, counter, classNames, props)

  return children(ref)
}
