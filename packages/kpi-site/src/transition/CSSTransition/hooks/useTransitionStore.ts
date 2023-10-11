import { isUndefined, useConstant } from '@kpi/shared'
import { useReducer } from 'react'

class TransitionStore<E extends HTMLElement> {
  constructor(private forceUpdate: () => void) {}

  instance: E | null = null

  setInstance = (instance: E | null, update?: boolean) => {
    this.instance = instance

    update && this.forceUpdate()
  }

  private $count = 0

  get updateGteTwoTimes() {
    return this.$count >= 2
  }

  get shouldUnmount() {
    return this.updateGteTwoTimes && !this.instance
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

  // 清理结束时的回调
  private $endCleanup: void | (() => void) = undefined

  setEndCleanup(callback?: void | (() => void)) {
    this.$endCleanup = callback
  }

  runEndCleanup(reset?: boolean) {
    this.$endCleanup && this.$endCleanup()

    if (reset) this.setEndCleanup(undefined)
  }
}

export default function useTransitionStore<E extends HTMLElement>() {
  const forceUpdate = useReducer((c) => c + 1, 0)[1]

  return useConstant(() => new TransitionStore<E>(forceUpdate))
}
