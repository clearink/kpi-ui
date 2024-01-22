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

      el.style.setProperty('display', 'none', 'important')
    },
  }

  appear = false

  hasMounted = false

  setHasMounted = (value: boolean) => {
    this.hasMounted = value
  }

  get running() {
    return isEnter(this.status) || isExit(this.status)
  }

  constructor(public forceUpdate: () => void, props: CSS<E>) {
    const { appear, when, unmountOnExit, mountOnEnter } = props

    this.appear = !!appear

    this.isMounted = when || !(unmountOnExit || mountOnEnter)

    if (!when) this.status = EXITED
    else this.status = appear ? ENTER : ENTERED
  }

  status: TransitionStatus

  isMounted: boolean

  setIsMounted = (value: boolean, forceUpdate = true) => {
    if (this.isMounted !== value && forceUpdate) this.forceUpdate()

    this.isMounted = value
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
    if (!isExited(store.status)) return

    store.setIsMounted(!(unmountOnExit || (!store.hasMounted && mountOnEnter)))
  })

  // when 变化时需要保证页面处于渲染中, 不必强制渲染一次更新 isMounted
  useDerivedState(when, () => store.setIsMounted(true, false))

  return store
}
