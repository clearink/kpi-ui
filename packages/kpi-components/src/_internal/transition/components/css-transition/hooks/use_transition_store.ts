// utils
import { useConstant, useWatchValue, useForceUpdate } from '@kpi-ui/hooks'
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
// types
import type { CSSTransitionProps as CSS, TransitionStatus, TransitionStep } from '../props'

export class TransitionStore<E extends HTMLElement> {
  constructor(public forceUpdate: () => void, props: CSS<E>) {
    const { appear, when, mountOnEnter, unmountOnExit } = props

    this.isMounted = !!when && !appear

    if (!when) this.status = EXITED
    else this.status = appear ? APPEAR : ENTERED

    if (when) this.scheduler.status = appear ? APPEAR_ACTION : NONE_ACTION
    else this.scheduler.status = mountOnEnter || unmountOnExit ? NONE_ACTION : MOUNT_ACTION
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
    status: NONE_ACTION,
    isReady: () => this.scheduler.status === APPEAR_READY,
    shouldMount: () => {
      const { status } = this.scheduler
      return status === MOUNT_ACTION || status === APPEAR_ACTION
    },
    beMounted: () => {
      if (this.scheduler.status === MOUNT_ACTION) {
        this.scheduler.status = NONE_ACTION
      } else if (this.scheduler.status === APPEAR_ACTION) {
        this.scheduler.status = APPEAR_READY
        this.scheduler.effect += 1
      }

      this.setIsMounted(true)
    },
    shouldRunFirst: () => {
      if (!this.scheduler.isReady()) return false

      this.scheduler.status = NONE_ACTION

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
  useWatchValue(`${unmountOnExit}-${mountOnEnter}`, () => {
    if (!isExited(store.status)) return

    const isMounted = !(unmountOnExit || (!store.hasMounted && mountOnEnter))

    returnEarly = isMounted !== store.isMounted

    store.setIsMounted(isMounted)
  })

  // when 变化时需要保证页面处于渲染中,
  useWatchValue(when, () => {
    returnEarly = store.isMounted !== true

    store.setIsMounted(true)
  })

  return [store, returnEarly] as const
}
