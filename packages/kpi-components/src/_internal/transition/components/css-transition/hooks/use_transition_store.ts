// utils
import { useConstant, useDerivedState, useForceUpdate } from '@kpi-ui/hooks'
import {
  APPEAR,
  ENTER,
  ENTERED,
  EXIT,
  EXITED,
  NEED_APPEAR,
  NEED_MOUNT,
  NONE,
  READY,
  isEntered,
  isExit,
  isExited,
} from '../../../constants'
// types
import type { CSSTransitionProps as CSS, TransitionStatus, TransitionStep } from '../props'

export class TransitionStore<E extends HTMLElement> {
  constructor(public forceUpdate: () => void, props: CSS<E>) {
    const { appear, when, mountOnEnter, unmountOnExit } = props

    this.isMounted = !!when && !appear

    if (!when) this.status = EXITED
    else this.status = appear ? APPEAR : ENTERED

    if (when) this.scheduler.status = appear ? NEED_APPEAR : NONE
    else this.scheduler.status = mountOnEnter || unmountOnExit ? NONE : NEED_MOUNT
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

  scheduler = {
    // 触发 useEffect
    effect: 0,
    status: NONE,
    isReady: () => this.scheduler.status === READY,
    shouldMount: () => {
      const { status } = this.scheduler
      return status === NEED_MOUNT || status === NEED_APPEAR
    },
    beMounted: () => {
      if (this.scheduler.status === NEED_MOUNT) {
        this.scheduler.status = NONE
      } else if (this.scheduler.status === NEED_APPEAR) {
        this.scheduler.status = READY
        this.scheduler.effect += 1
      }
      this.setIsMounted(true)
    },
    shouldRunFirst: () => {
      if (!this.scheduler.isReady()) return false

      this.scheduler.status = NONE

      return true
    },
  }

  hasMounted = false

  setHasMounted = () => {
    this.hasMounted = true
  }

  status: TransitionStatus

  setStatus = (value: TransitionStatus) => {
    this.status = value
  }

  isMounted = false

  setIsMounted = (value: boolean) => {
    if (this.isMounted !== value) this.forceUpdate()

    this.isMounted = value
  }

  instance: E | null = null

  setInstance = (instance: E | null) => {
    this.instance = instance
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
    this.setStatus(isExit(step) ? EXIT : ENTER)

    !isExit(step) && this.display.show(display)
  }

  done = (step: TransitionStep) => {
    this.setStatus(isExit(step) ? EXITED : ENTERED)

    this.runEndHook()
  }

  shouldTransition = (when: boolean | undefined) => {
    return when ? !isEntered(this.status) : !isExited(this.status)
  }
}

export default function useTransitionStore<E extends HTMLElement>(props: CSS<E>) {
  const { when, unmountOnExit, mountOnEnter } = props

  const forceUpdate = useForceUpdate()

  const store = useConstant(() => new TransitionStore<E>(forceUpdate, props))

  let returnEarly = false

  // 监听 unmountOnExit 与 mountOnEnter
  useDerivedState(`${unmountOnExit}-${mountOnEnter}`, () => {
    if (!isExited(store.status)) return

    const isMounted = !(unmountOnExit || (!store.hasMounted && mountOnEnter))

    returnEarly = isMounted !== store.isMounted

    store.setIsMounted(isMounted)
  })

  // when 变化时需要保证页面处于渲染中,
  useDerivedState(when, () => {
    returnEarly = store.isMounted !== true

    store.setIsMounted(true)
  })

  return [store, returnEarly] as const
}
