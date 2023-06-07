/* eslint-disable max-classes-per-file */
import { isBoolean } from '@kpi/shared'
import driver from '../../frame-loop'
import { pushItem } from '../../utils/array'
import { percentage } from '../../utils/interpolator'

import type { Emitter } from './value/utils/emitter'

export class TweenBase {
  start = 0

  duration = 0

  delay = 0

  // 保证 repeat >= 0
  repeat = 0

  repeatType = 'loop'

  repeatDelay = 0

  get end() {
    const cycle = this.duration + this.repeatDelay

    return this.delay + this.start + this.duration + cycle * this.repeat
  }

  protected window = [-Infinity, -Infinity]

  protected get waiting() {
    const [pre, now] = this.window

    return pre < 0 && now < 0
  }

  protected get completed() {
    const whole = this.end - this.start

    const [pre, now] = this.window

    return pre >= whole && now > whole
  }

  protected get starting() {
    const [pre, now] = this.window

    return pre < 0 && now >= 0
  }

  protected get completing() {
    const whole = this.end - this.start

    const [pre, now] = this.window

    return pre < whole && now >= whole
  }

  // 当前进度, 目前进度
  protected get progresses() {
    const { duration, repeatDelay, repeat, window } = this

    const [pre, now] = this.window

    if (!duration) return [pre, 1]

    const cycle = duration + repeatDelay

    const done = Math.min(Math.floor(now / cycle), repeat) * cycle

    return window.map((t) => percentage(t - done, [0, duration]))
  }

  protected get running() {
    const [pre, now] = this.progresses

    return pre >= 0 && now <= 1
  }

  protected get repeating() {
    const [pre, now] = this.progresses

    return pre < 0 && now >= 0 && !this.starting
  }

  tick(timestamp: number): boolean | number {
    const { start, delay } = this

    const elapsed = timestamp - start - delay

    pushItem(this.window, elapsed).shift()

    // this.ratios = getRatios(this, this.window)

    if (this.waiting || this.completed) return false

    const [pre, now] = this.progresses

    if (pre >= 1 && now > 1) return false

    return now
  }
}

export class Tween extends TweenBase {
  constructor(public emitter: Emitter, render: (progress: number) => void) {
    super()

    this.tick = (timestamp: number) => {
      const progress = super.tick(timestamp)

      if (isBoolean(progress)) return !this.completed

      // 如何区分 motion 与 options.event 呢?
      this.starting && emitter('start')

      this.repeating && emitter('repeat')

      render(progress)

      this.running && emitter('update')

      this.completing && emitter('complete')

      return progress
    }
  }
}

export class PlaybackControl extends TweenBase {
  status: AnimationPlayState = 'idle'

  private $start = 0

  constructor(private tweens: (Tween | PlaybackControl)[]) {
    super()
    this.duration = tweens[tweens.length - 1]?.end ?? 0
  }

  tick = (timestamp: number) => {
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

  play = () => {
    // "finished" | "idle" | "paused" | "running"
    this.status = 'running'
    driver.start(this.tick)
  }

  stop = () => {
    this.status = 'idle'
    driver.cancel(this.tick)
  }
}
