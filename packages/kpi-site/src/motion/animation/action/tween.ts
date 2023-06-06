/* eslint-disable prefer-destructuring */
import { pushItem } from '../../utils/array'
import clamp from '../../utils/clamp'
import { percentage } from '../../utils/interpolator'

import type { MotionValue } from '../../motion'
import type { AnimatableValue } from '../interface'

export default class Tween<V extends AnimatableValue = AnimatableValue> {
  public start = 0

  public duration = 0

  public delay = 0

  public repeat = 0

  public repeatType = 'loop'

  public repeatDelay = 0

  public get end() {
    const cycle = this.duration + this.repeatDelay

    return this.delay + this.start + this.duration + cycle * this.repeat
  }

  public window: number[] = [-Infinity, -Infinity]

  protected get ratios() {
    const { duration, repeatDelay } = this

    if (!duration) return [this.window[0], 1]

    const cycle = duration + repeatDelay

    return this.window.map((t) => percentage(t % cycle, [0, duration]))
  }

  protected get waiting() {
    const [pre, now] = this.window

    return pre < 0 && now < 0
  }

  public get starting() {
    const [pre, now] = this.ratios

    return pre < 0 && now >= 0
  }

  public get completing() {
    const [pre, now] = this.ratios

    return pre < 1 && now >= 1
  }

  protected get completed() {
    const whole = this.end - this.start

    const [pre, now] = this.window

    return pre >= whole && now > whole
  }

  public tick: (timestamp: number) => null | [number, NonNullable<V>]

  constructor(
    public notify: MotionValue<V>['notify'],
    generator: (progress: number) => NonNullable<V>
  ) {
    this.tick = (timestamp: number) => {
      const elapsed = timestamp - this.start - this.delay

      // 更新滑动窗口数据
      pushItem(this.window, elapsed).shift()

      if (this.waiting || this.completed) return null

      const [pre, now] = this.ratios

      // repeat delay timing
      if (pre >= 1 && now > 1) return null

      const progress = clamp(now, 0, 1)
      console.log(pre, now)

      // TODO: 考虑 repeatType 对 generator 的影响
      return [progress, generator(progress)]
    }
  }
}
