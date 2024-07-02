import { useConstant, useForceUpdate, useWatchValue } from '_shared/hooks'
import { showElement } from '_shared/utils'
import { useMemo } from 'react'

import type { CSSTransitionProps as CSS, TransitionStatus, TransitionStep } from '../props'

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

export class TransitionState<E extends HTMLElement> {
  cleanupHook: (() => void) | void = undefined

  hasMounted = false

  instance: E | null = null

  isInitial = true

  isMounted = false

  status: TransitionStatus

  constructor(props: CSS<E>) {
    const { appear, mountOnEnter, unmountOnExit, when } = props

    this.isMounted = when || !(unmountOnExit || mountOnEnter)

    if (!when) this.status = EXITED
    else this.status = appear ? APPEAR : ENTERED
  }
}

export class TransitionAction<E extends HTMLElement> {
  finishTransition = (step: TransitionStep) => {
    this.states.status = isExit(step) ? EXITED : ENTERED

    this.runCleanupHook()
  }

  runCleanupHook = () => {
    this.states.cleanupHook?.()

    this.states.cleanupHook = undefined
  }

  setIsInitial = (value: boolean) => {
    this.states.isInitial = value
  }

  setIsMounted = (value: boolean) => {
    if (this.states.isMounted !== value) this.forceUpdate()

    this.states.isMounted = value
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

  shouldTransition = (when: boolean | undefined) => {
    const { status } = this.states

    return when ? !isEntered(status) : !isExited(status)
  }

  startTransition = (step: TransitionStep, display: string | undefined) => {
    this.states.status = isExit(step) ? EXIT : ENTER

    !isExit(step) && showElement(this.states.instance, display)
  }

  constructor(
    private forceUpdate: () => void,
    private states: TransitionState<E>,
  ) {}
}

export default function useTransitionStore<E extends HTMLElement>(props: CSS<E>) {
  const { mountOnEnter, unmountOnExit, when } = props

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

  return { actions, returnEarly, states }
}
