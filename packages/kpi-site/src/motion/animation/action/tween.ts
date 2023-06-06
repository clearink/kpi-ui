import { pushItem } from '../../utils/array'
import clamp from '../../utils/clamp'

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

  public sliding: number[] = [-Infinity, -Infinity]

  protected get waiting() {
    const [pre, now] = this.sliding
    return pre < 0 && now < 0
  }

  protected get completed() {
    const whole = this.end - this.start
    const [pre, now] = this.sliding
    return pre >= whole && now > whole
  }

  public tick: (time: number) => NonNullable<V> | null

  constructor(generator: (progress: number) => NonNullable<V>) {
    this.tick = (time: number) => {
      const { start, delay, duration, repeatDelay } = this

      const elapsed = time - start - delay

      // update sliding
      pushItem(this.sliding, elapsed).shift()

      if (this.waiting || this.completed) return null

      const cycle = duration + repeatDelay

      const [pre, now] = this.sliding.map((t) => (t % cycle) / duration)

      if (pre >= 1 && now > 1) return null

      // TODO: repeatType logic

      return generator(clamp(now, 0, 1))
    }
  }
}
