import { useConstant, useForceUpdate, useWatchValue } from '_shared/hooks'
import { showElement } from '_shared/utils'
import { useMemo } from 'react'

import {
  APPEAR,
  ENTER,
  ENTERED,
  EXIT,
  EXITED,
  isAppear,
  isEntered,
  isExit,
  isExited,
} from '../../../constants'
import type { CSSTransitionProps as CSS, TransitionStatus, TransitionStep } from '../props'

export class TransitionState<E extends HTMLElement> {
  constructor(props: CSS<E>) {
    const { appear, when, mountOnEnter, unmountOnExit } = props

    this.isMounted = when || !(unmountOnExit || mountOnEnter)

    if (!when) this.status = EXITED
    else this.status = appear ? APPEAR : ENTERED
  }

  isInitial = true

  hasMounted = false

  status: TransitionStatus

  isMounted = false

  instance: E | null = null

  cleanupHook: void | (() => void) = undefined
}

export class TransitionAction<E extends HTMLElement> {
  constructor(private forceUpdate: () => void, private states: TransitionState<E>) {}

  runCleanupHook = () => {
    this.states.cleanupHook?.()

    this.states.cleanupHook = undefined
  }

  setIsMounted = (value: boolean) => {
    if (this.states.isMounted !== value) this.forceUpdate()

    this.states.isMounted = value
  }

  setIsInitial = (value: boolean) => {
    this.states.isInitial = value
  }

  startTransition = (step: TransitionStep, display: string | undefined) => {
    this.states.status = isExit(step) ? EXIT : ENTER

    !isExit(step) && showElement(this.states.instance, display)
  }

  finishTransition = (step: TransitionStep) => {
    this.states.status = isExit(step) ? EXITED : ENTERED

    this.runCleanupHook()
  }

  shouldTransition = (when: boolean | undefined) => {
    const { status } = this.states

    return when ? !isEntered(status) : !isExited(status)
  }

  shouldAppear = (isInitial: boolean, when: boolean | undefined) => {
    return isInitial && when && isAppear(this.states.status)
  }

  shouldEnter = (isInitial: boolean, when: boolean | undefined) => {
    return !isInitial && when && !isEntered(this.states.status)
  }

  shouldExit = (isInitial: boolean, when: boolean | undefined) => {
    const { status } = this.states

    return !isInitial && !when && !isExited(status) && !isAppear(status)
  }
}

export default function useTransitionStore<E extends HTMLElement>(props: CSS<E>) {
  const { when, unmountOnExit, mountOnEnter } = props

  const update = useForceUpdate()

  const states = useConstant(() => new TransitionState<E>(props))

  const actions = useMemo(() => new TransitionAction<E>(update, states), [states, update])

  let returnEarly = false

  // 监听 unmountOnExit 与 mountOnEnter
  useWatchValue(`${unmountOnExit}-${mountOnEnter}`, () => {
    if (!isExited(states.status)) return

    const isMounted = !(unmountOnExit || (!states.hasMounted && mountOnEnter))

    returnEarly = isMounted !== states.isMounted

    actions.setIsMounted(isMounted)
  })

  // when 变化时需要保证页面处于渲染中,
  useWatchValue(when, () => {
    returnEarly = states.isMounted !== true

    actions.setIsMounted(true)
  })

  return { states, actions, returnEarly }
}
