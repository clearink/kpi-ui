import { isUndefined, useConstant } from '@kpi/shared'
import { truncate } from 'fs'

export const UNMOUNTED = 'unmounted'
export const EXITED = 'exited'
export const ENTERING = 'entering'
export const ENTERED = 'entered'
export const EXITING = 'exiting'
export const ENTER = 'enter'
export const EXIT = 'exit'

class TransitionStore<E extends HTMLElement> {
  instance: E | null = null

  setInstance = (instance: E | null) => {
    this.instance = instance
  }

  private $count = 0

  get updateGteTwoTimes() {
    return this.$count >= 2
  }

  updateCounter() {
    this.$count += 1
  }

  private $running = false

  running(): boolean
  running(running: boolean): boolean
  running(args?: boolean) {
    if (!isUndefined(args)) this.$running = args

    return this.$running
  }
}

export default function useTransitionStore<E extends HTMLElement>() {
  return useConstant(() => new TransitionStore<E>())
}
