/* eslint-disable max-classes-per-file */
import { isBoolean } from '@kpi/shared'
import { pushItem } from '../../utils/array'
import { percentage } from '../../utils/interpolator'

import driver from '../../frame-loop'

import type { AnimatableValue } from '../interface'
import type { MotionEventCallbacks } from '../../motion/interface'

export class TweenBase {
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

  protected window: number[] = [-Infinity, -Infinity]

  protected get ratios() {
    const { duration, repeatDelay } = this

    const [pre, now] = this.window

    if (!duration) return [pre, 1]

    const cycle = duration + repeatDelay

    // TODO: 这里有一点问题
    const done = Math.floor(now / cycle)

    return this.window.map((t) => percentage(t - done * cycle, [0, duration]))
  }

  protected get waiting() {
    const [pre, now] = this.window

    return pre < 0 && now < 0
  }

  protected get starting() {
    const [pre, now] = this.ratios

    return pre < 0 && now >= 0
  }

  protected get completing() {
    const [pre, now] = this.ratios

    return pre < 1 && now >= 1
  }

  protected get running() {
    const [pre, now] = this.ratios

    return pre >= 0 && now <= 1
  }

  protected get completed() {
    const whole = this.end - this.start

    const [pre, now] = this.window

    return pre >= whole && now > whole
  }

  public tick(timestamp: number): boolean | number {
    const elapsed = timestamp - this.start - this.delay

    pushItem(this.window, elapsed).shift()

    if (this.waiting || this.completed) return false

    const [pre, now] = this.ratios

    if (pre >= 1 && now > 1) return false

    return now
  }
}

export class Tween<V extends AnimatableValue = AnimatableValue> extends TweenBase {
  constructor(
    private emitter: (type: keyof MotionEventCallbacks<V>) => void,
    render: (progress: number) => void
  ) {
    super()

    this.tick = (timestamp: number) => {
      const progress = super.tick(timestamp)

      console.log('tween', progress)
      if (isBoolean(progress)) return !this.completed

      this.starting && this.emitter('start')

      render(progress)

      this.running && this.emitter('update')

      this.completing && this.emitter('complete')

      return progress
    }
  }
}

export class PlaybackControl extends TweenBase {
  public status: AnimationPlayState = 'idle'

  private $start = 0

  constructor(private tweens: Tween[]) {
    super()
    this.duration = tweens[tweens.length - 1]?.end ?? 0
  }

  public tick = (timestamp: number) => {
    if (!this.$start) this.$start = timestamp

    const progress = super.tick(timestamp - this.$start)

    if (isBoolean(progress)) return !this.completed

    // TODO: 触发事件
    // this.starting && this.emitter('start')

    this.tweens.forEach((tween) => tween.tick(progress * this.duration))

    // this.running && this.emitter('update')

    // this.completing && this.emitter('complete')

    return !this.completed
  }

  public play = () => {
    // "finished" | "idle" | "paused" | "running"
    this.status = 'running'
    driver.start(this.tick)
  }

  public stop = () => {
    this.status = 'idle'
    driver.cancel(this.tick)
  }
}
