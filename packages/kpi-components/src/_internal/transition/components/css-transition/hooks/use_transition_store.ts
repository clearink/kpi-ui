// utils
import { useConstant, useForceUpdate, useWatchValue } from '@kpi-ui/hooks'
import { useMemo } from 'react'
import {
  APPEAR,
  ENTER,
  ENTERED,
  EXIT,
  EXITED,
  isEntered,
  isExit,
  isExited,
} from '../../../constants'
import { APPEAR_ACTION, APPEAR_READY, MOUNT_ACTION, NONE_ACTION } from '../constants'
import { showElement } from '../utils/display'
// types
import type { CSSTransitionProps as CSS, TransitionStatus, TransitionStep } from '../props'

export class TransitionState<E extends HTMLElement> {
  constructor(props: CSS<E>) {
    const { appear, when, mountOnEnter, unmountOnExit } = props

    this.isMounted = !!when && !appear

    if (!when) this.status = EXITED
    else this.status = appear ? APPEAR : ENTERED

    if (when) this.scheduler = appear ? APPEAR_ACTION : NONE_ACTION
    else this.scheduler = mountOnEnter || unmountOnExit ? NONE_ACTION : MOUNT_ACTION
  }

  effect = 0

  scheduler = NONE_ACTION

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

  shouldMount = () => {
    const { instance, scheduler } = this.states

    return !instance && (scheduler === MOUNT_ACTION || scheduler === APPEAR_ACTION)
  }

  beMounted = () => {
    const { scheduler } = this.states

    if (scheduler === MOUNT_ACTION) {
      this.states.scheduler = NONE_ACTION
    } else if (scheduler === APPEAR_ACTION) {
      this.states.scheduler = APPEAR_READY
      this.states.effect += 1
    }

    this.setIsMounted(true)
  }

  shouldRunFirst = () => {
    const isCanAppear = this.states.scheduler === APPEAR_READY

    if (isCanAppear) this.states.scheduler = NONE_ACTION

    return isCanAppear
  }
}

export default function useTransitionStore<E extends HTMLElement>(props: CSS<E>) {
  const { when, unmountOnExit, mountOnEnter } = props

  const forceUpdate = useForceUpdate()

  const states = useConstant(() => new TransitionState<E>(props))

  const actions = useMemo(() => new TransitionAction<E>(forceUpdate, states), [states, forceUpdate])

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

    // when 改变时需要修改 states.scheduler 防止数据不对
    if (states.scheduler === APPEAR_READY && !when) {
      states.scheduler = NONE_ACTION
    }
    console.log(states.scheduler, when)

    actions.setIsMounted(true)
  })

  return { states, actions, returnEarly }
}
