// utils
import { useConstant, useDerivedState, useForceUpdate } from '@kpi-ui/hooks'
import { addClassNames, delClassNames } from '@kpi-ui/utils'
import {
  APPEAR,
  ENTER,
  ENTERED,
  EXIT,
  EXITED,
  isAppear,
  isEnter,
  isEntered,
  isExit,
  isExited,
} from '../../../constants'
// types
import type { CSSTransitionProps as CSS, TransitionStatus, TransitionStep } from '../props'

const additional = Symbol.for('additional-class')

export class TransitionStore<E extends HTMLElement> {
  constructor(public forceUpdate: () => void, props: CSS<E>) {
    const { appear, when, unmountOnExit, mountOnEnter } = props

    this.appear = !!appear

    this.isMounted = when || !(unmountOnExit || mountOnEnter)

    if (!when) this.status = EXITED
    else this.status = appear ? APPEAR : ENTERED
  }

  classNames = {
    add: (...classes: (string | undefined)[]) => {
      const el = this.instance as null | (E & { [additional]?: Set<string | undefined> })

      if (!el) return

      addClassNames(el, ...classes)

      if (!el[additional]) el[additional] = new Set()

      classes.forEach((cls) => el[additional]!.add(cls))
    },
    del: (...classes: (string | undefined)[]) => {
      const el = this.instance as null | (E & { [additional]?: Set<string | undefined> })

      if (!el) return

      delClassNames(el, ...classes)

      if (el[additional]) classes.forEach((cls) => el[additional]!.delete(cls))
    },
    restore: () => {
      const el = this.instance as null | (E & { [additional]?: Set<string | undefined> })

      if (!el) return

      if (el[additional]) el[additional].forEach((cls) => addClassNames(el, cls))
    },
  }

  display = {
    show: (display: undefined | string) => {
      const el = this.instance

      el && el.style.setProperty('display', display || '')
    },
    hide: () => {
      const el = this.instance

      el && el.style.setProperty('display', 'none')
    },
  }

  appear = false

  hasMounted = false

  setHasMounted = () => {
    this.hasMounted = true
  }

  get running() {
    return isEnter(this.status) || isExit(this.status)
  }

  status: TransitionStatus

  isMounted: boolean

  setIsMounted = (value: boolean) => {
    if (this.isMounted !== value) this.forceUpdate()

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

  start = (step: TransitionStep, display: string | undefined) => {
    this.status = isExit(step) ? EXIT : ENTER

    !isExit(step) && this.display.show(display)
  }

  finish = (step: TransitionStep) => {
    this.status = isExit(step) ? EXITED : ENTERED

    this.runEndHook()
  }

  shouldTransition = (isInitial: boolean, when?: boolean) => {
    if (isInitial) return isAppear(this.status)

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

  // when 变化时需要保证页面处于渲染中,
  useDerivedState(when, () => store.setIsMounted(true))

  return store
}
