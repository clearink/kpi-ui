import { useConstant, useForceUpdate, useDerivedState } from '@kpi/shared'
import { useState } from 'react'
import {
  ENTER,
  ENTERED,
  EXIT,
  EXITED,
  isEnter,
  isEntered,
  isExit,
  isExited,
} from '../constants/status'

import type { CSSTransitionProps as CSS, TransitionStep } from '../props'

class TransitionStore<E extends HTMLElement> {
  constructor(public forceUpdate: () => void, props: CSS<E>) {
    const { appear, when, unmountOnExit } = props

    this.appear = !!appear

    this.unmount = !!unmountOnExit && !when

    if (!when) this.status = EXITED
    else this.status = appear ? ENTER : ENTERED
  }

  // 避免严格模式时 appear=true when=false 额外多执行一次 exit 动画
  status: typeof ENTER | typeof ENTERED | typeof EXIT | typeof EXITED

  appear = false

  unmount = false

  instance: E | null = null

  isInitial = true

  running = false

  endHook: void | (() => void) = undefined

  runEndHook = () => {
    this.endHook && this.endHook()

    this.endHook = undefined
  }

  prepareHidden = () => {
    const el = this.instance

    if (!el) return

    el.dataset.display = el.style.getPropertyValue('display')
    el.dataset.priority = el.style.getPropertyPriority('display')
  }

  hidden = () => {
    const el = this.instance

    if (!el) return

    el.style.display = 'none'
  }

  show = () => {
    const el = this.instance

    if (!el) return

    const value = el.dataset.display || ''
    const priority = el.dataset.priority || ''

    el.style.setProperty('display', value, priority)
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
    if (store.isInitial || store.running) return

    store.forceUpdate()

    store.unmount = !!unmountOnExit && !when
  })

  return store
}
