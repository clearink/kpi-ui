import { useConstant, useForceUpdate, useDerivedState } from '@kpi-ui/hooks'
import {
  ENTER,
  ENTERED,
  EXIT,
  EXITED,
  isEnter,
  isEntered,
  isExit,
  isExited,
} from '../../_shared/constant'

import type { CSSTransitionProps as CSS, TransitionStatus, TransitionStep } from '../props'

const explicit = Symbol.for('explicit-display')
export class TransitionStore<E extends HTMLElement> {
  constructor(public forceUpdate: () => void, props: CSS<E>) {
    const { appear, when, unmountOnExit } = props

    this.appear = !!appear

    this.unmount = !!unmountOnExit && !when

    if (!when) this.status = EXITED
    else this.status = appear ? ENTER : ENTERED
  }

  status: TransitionStatus

  appear = false

  unmount = false

  instance: E | null = null

  setInstance = (instance: E | null) => {
    this.instance = instance
  }

  isInitial = true

  setIsInitial = (isInitial: boolean) => {
    this.isInitial = isInitial
  }

  running = false

  endHook: void | (() => void) = undefined

  setEndHook = (endHook: void | (() => void)) => {
    this.endHook = endHook
  }

  runEndHook = () => {
    this.endHook && this.endHook()

    this.endHook = undefined
  }

  prepareHidden = () => {
    const el = this.instance as null | (E & { [explicit]: { display: string; priority: string } })

    if (!el) return

    const display = el.style.getPropertyValue('display')
    const priority = el.style.getPropertyPriority('display')

    el[explicit] = { display, priority }
  }

  hidden = () => {
    const el = this.instance

    if (!el) return

    el.style.display = 'none'
  }

  show = () => {
    const el = this.instance as null | (E & { [explicit]: { display: string; priority: string } })

    if (!el) return

    const { display, priority } = el[explicit]

    el.style.setProperty('display', display, priority)
  }

  destroy = () => {
    this.unmount = true

    this.forceUpdate()
  }

  start = (step: TransitionStep) => {
    this.running = true

    this.unmount = false

    this.status = isExit(step) ? EXIT : ENTER

    isExit(step) ? this.prepareHidden() : this.show()
  }

  finish = (step: TransitionStep) => {
    this.running = false

    this.status = isExit(step) ? EXITED : ENTERED

    this.runEndHook()
  }

  shouldTransition = (isInitial: boolean, when?: boolean) => {
    if (isInitial) return isEnter(this.status)

    return when ? !isEntered(this.status) : !isExited(this.status)
  }
}

export default function useTransitionStore<E extends HTMLElement>(props: CSS<E>) {
  const { when, unmountOnExit } = props

  const forceUpdate = useForceUpdate()

  const store = useConstant(() => new TransitionStore<E>(forceUpdate, props))

  useDerivedState(unmountOnExit, () => {
    const unmount = !!unmountOnExit && !when

    if (!isExited(store.status) || store.unmount === unmount) return

    store.unmount = unmount

    store.forceUpdate()
  })

  return store
}
