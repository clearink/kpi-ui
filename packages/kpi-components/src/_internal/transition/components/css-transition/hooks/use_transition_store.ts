import { useConstant, useDerivedState, useForceUpdate } from '@kpi-ui/hooks'
import {
  ENTER,
  ENTERED,
  EXIT,
  EXITED,
  isEnter,
  isEntered,
  isExit,
  isExited,
} from '../../../constant'

import type { CSSTransitionProps as CSS, TransitionStatus, TransitionStep } from '../props'

const explicit = Symbol.for('explicit-display')

export class TransitionStore<E extends HTMLElement> {
  display = {
    show: () => {
      const el = this.instance

      if (!el) return

      const { display, priority } = el[explicit]

      el.style.setProperty('display', display, priority)
    },
    stash: () => {
      const el = this.instance

      if (!el) return

      const display = el.style.getPropertyValue('display')
      const priority = el.style.getPropertyPriority('display')

      el[explicit] = { display, priority }
    },
    hide: () => {
      const el = this.instance

      if (!el) return

      el.style.display = 'none'
    },
  }

  appear = false

  mounted = false

  setMounted = (mounted: boolean) => {
    this.mounted = mounted
  }

  get running() {
    return isEnter(this.status) || isExit(this.status)
  }

  constructor(public forceUpdate: () => void, props: CSS<E>) {
    const { appear, when, unmountOnExit, mountOnEnter } = props

    this.appear = !!appear

    this.unmount = (!!unmountOnExit || !!mountOnEnter) && !when

    if (!when) this.status = EXITED
    else this.status = appear ? ENTER : ENTERED
  }

  status: TransitionStatus

  unmount = false

  updateUnmount = (unmount: boolean) => {
    if (this.unmount !== unmount) this.forceUpdate()

    this.unmount = unmount
  }

  instance: E | null = null

  setInstance = (instance: E | null) => {
    this.instance = instance
  }

  isInitial = true

  setIsInitial = (isInitial: boolean) => {
    this.isInitial = isInitial
  }

  endHook: void | (() => void) = undefined

  setEndHook = (endHook: void | (() => void)) => {
    this.endHook = endHook
  }

  runEndHook = () => {
    this.endHook && this.endHook()

    this.endHook = undefined
  }

  start = (step: TransitionStep) => {
    this.updateUnmount(false)

    this.status = isExit(step) ? EXIT : ENTER

    isExit(step) ? this.display.stash() : this.display.show()
  }

  finish = (step: TransitionStep) => {
    this.status = isExit(step) ? EXITED : ENTERED

    this.runEndHook()
  }

  shouldTransition = (isInitial: boolean, when?: boolean) => {
    if (isInitial) return isEnter(this.status)

    return when ? !isEntered(this.status) : !isExited(this.status)
  }
}

export default function useTransitionStore<E extends HTMLElement>(props: CSS<E>) {
  const { when, unmountOnExit, mountOnEnter } = props

  const forceUpdate = useForceUpdate()

  const store = useConstant(() => new TransitionStore<E>(forceUpdate, props))

  // 监听 unmountOnExit 与 mountOnEnter
  useDerivedState(`${unmountOnExit}-${mountOnEnter}`, () => {
    const unmount = (!!unmountOnExit || (!store.mounted && !!mountOnEnter)) && !when

    if (isExited(store.status)) store.updateUnmount(unmount)
  })

  return store
}
