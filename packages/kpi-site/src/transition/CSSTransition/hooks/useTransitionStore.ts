import { isUndefined, useConstant } from '@kpi/shared'

class TransitionStore<E extends HTMLElement> {
  /** 保存 dom 实例 */
  instance: E | null = null

  setInstance = (el: E | null) => {
    this.instance = el
  }

  private $updateCount = 0

  updateCounter = () => {
    this.$updateCount += 1
  }

  get isInitial() {
    return this.$updateCount < 2
  }

  private $running = false

  running = (val?: boolean) => {
    if (!isUndefined(val)) this.$running = val

    return this.$running
  }

  private $endHook: void | (() => void) = undefined

  setEndHook = (callback?: void | (() => void)) => {
    this.$endHook = callback
  }

  runEndHook = () => {
    this.$endHook && this.$endHook()

    this.setEndHook(undefined)
  }

  private $initHook: void | (() => void) = undefined

  setInitHook = (callback?: void | (() => void)) => {
    this.$initHook = callback
  }

  runInitHook = () => {
    this.$initHook && this.$initHook()

    this.setInitHook(undefined)
  }
}

export default function useTransitionStore<E extends HTMLElement>() {
  return useConstant(() => new TransitionStore<E>())
}
