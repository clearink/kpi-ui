import { pushItem } from '../../utils/array'
import clamp from '../../utils/clamp'

import type { AnimatableValue } from '../interface'

export default class Tween<V extends AnimatableValue = AnimatableValue> {
  public start = 0

  public duration = 0

  public delay = 0

  public get end() {
    return this.start + this.delay + this.duration
  }

  // 维护一个滑动窗口用来检测是否可以 animated
  public sliding: [number, number] = [-0.1, -0.1]

  public tick: (time: number) => void

  constructor(
    public trigger: (sliding: [number, number], current: NonNullable<V>) => void,
    generator: (progress: number) => NonNullable<V>
  ) {
    this.tick = (time: number) => {
      let elapsed = (time - this.start - this.delay) / this.duration

      elapsed = Number.isNaN(elapsed) ? 1 : elapsed

      pushItem(this.sliding, elapsed).shift()

      if (this.sliding[0] < 0 && this.sliding[1] < 0) return
      if (this.sliding[0] > 1 && this.sliding[1] > 1) return

      const progress = clamp(elapsed, 0, 1)

      const current = generator(progress)

      // TODO: 需要重新设计,以便能够触发各种事件
      trigger(this.sliding, current)
    }
  }
}
