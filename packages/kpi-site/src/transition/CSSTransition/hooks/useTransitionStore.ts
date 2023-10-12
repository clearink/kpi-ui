import { isUndefined, useConstant, useForceUpdate } from '@kpi/shared'

class TransitionStore<E extends HTMLElement> {
  constructor(private forceUpdate: () => void) {}

  /** 保存 dom 实例 */
  instance: E | null = null

  setInstance = (instance: E | null) => {
    this.instance = instance
  }

  /** 记录更新次数 */
  private $count = 0

  get updateGteTwoTimes() {
    return this.$count >= 2
  }

  updateCounter() {
    this.$count += 1
  }

  /** 是否正在执行动画  */
  private $running = false

  running(): boolean
  running(running: boolean): boolean
  running(args?: boolean) {
    if (!isUndefined(args)) this.$running = args

    return this.$running
  }

  /** 记录清除动画结束的回调函数 */
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
  const forceUpdate = useForceUpdate()

  return useConstant(() => new TransitionStore<E>(forceUpdate))
}
