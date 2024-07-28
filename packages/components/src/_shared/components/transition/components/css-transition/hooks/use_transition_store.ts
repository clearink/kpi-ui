import type { VoidFn } from '@internal/types'

import { useConstant, useForceUpdate, useWatchValue } from '@comps/_shared/hooks'
import { showElement } from '@comps/_shared/utils'
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
  cleanupHook: VoidFn | void = undefined

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

  setCleanupHook = (hook?: VoidFn | void) => {
    this.states.cleanupHook = hook
  }

  runCleanupHook = () => {
    this.states.cleanupHook?.()

    this.setCleanupHook(undefined)
  }

  setInstance = (el: E | null) => {
    this.states.instance = el
  }

  markHasMounted = () => {
    this.states.hasMounted = true
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

  // 监听 unmountOnExit 与 mountOnEnter
  const returnEarly1 = useWatchValue(`${unmountOnExit}-${mountOnEnter}`, () => {
    if (!isExited(states.status)) return false

    const isMounted = !(unmountOnExit || (!states.hasMounted && mountOnEnter))

    actions.setIsMounted(isMounted)

    return isMounted !== states.isMounted
  })

  // when 变化时需要保证页面处于渲染中,
  const returnEarly2 = useWatchValue(when, () => {
    actions.setIsMounted(true)

    return states.isMounted !== true
  })

  return { returnEarly: returnEarly1 || returnEarly2, actions, states }
}
