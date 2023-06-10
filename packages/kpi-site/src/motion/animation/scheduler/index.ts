/* eslint-disable max-classes-per-file */
import { isBoolean, isNullish } from '@kpi/shared'
import { pushItem } from '../../utils/array'
import clamp from '../../utils/clamp'
import driver from '../driver'
import { TweenOptions } from '../interface'

import type { Emitter } from '../action/value/utils/emitter'

export class TweenScheduler {
  start = 0

  delay = 0

  duration = 0

  repeat = 0

  repeatDelay = 0

  get end() {
    const { delay, start, duration, repeatDelay, repeat } = this

    return delay + start + duration + (repeatDelay + duration) * repeat
  }

  protected get whole() {
    return this.end - this.start
  }

  protected sliding = [-Infinity, -Infinity]

  // TODO: 当 repeat = Infinity 时，会对Controller 造成影响
  protected get ratios() {
    const { duration, repeatDelay, sliding } = this

    if (!duration) return [-Infinity, 1]

    const done = this.iterations * (repeatDelay + duration)

    return sliding.map((elapsed) => (elapsed - done) / duration)
  }

  get iterations() {
    const { duration, repeatDelay, repeat, sliding } = this

    const cycle = repeatDelay + duration

    return Math.min(Math.floor(sliding[1] / cycle), repeat)
  }

  get waiting() {
    return this.sliding[0] < 0 && this.sliding[1] < 0
  }

  get completed() {
    return this.sliding[0] >= this.whole && this.sliding[1] > this.whole
  }

  get starting() {
    return this.sliding[0] < 0 && this.sliding[1] >= 0
  }

  get repeating() {
    return !this.starting && this.ratios[0] < 0 && this.ratios[1] >= 0
  }

  get completing() {
    return this.sliding[0] < this.whole && this.sliding[1] >= this.whole
  }

  constructor(options: TweenOptions) {
    const { start, delay, duration, repeat, repeatDelay } = options

    !isNullish(start) && (this.start = start)

    !isNullish(delay) && (this.delay = delay)

    !isNullish(duration) && (this.duration = duration)

    !isNullish(repeat) && (this.repeat = repeat)

    !isNullish(repeatDelay) && (this.repeatDelay = repeatDelay)
  }

  schedule(timestamp: number): boolean | number {
    const { start, delay, sliding } = this

    const elapsed = timestamp - start - delay

    pushItem(sliding, elapsed).shift()

    if (this.waiting || this.completed) return false

    const [pre, now] = this.ratios

    // repeat delay
    if (pre >= 1 && now > 1) return false

    return now
  }
}

export class TweenRenderer extends TweenScheduler {
  constructor(
    public emitter: Emitter,
    render: (ratio: number, iterations: number) => void,
    options: TweenOptions
  ) {
    super(options)

    this.schedule = (timestamp: number) => {
      const ratio = super.schedule(timestamp)

      if (isBoolean(ratio)) return !this.completed

      this.starting && this.emitter('start')

      // 修复 duration = Infinity 时的错误
      const adjusted = Number.isNaN(ratio) ? 0 : ratio

      render(clamp(adjusted, 0, 1), this.iterations)

      this.emitter('update')

      // TODO: 是否还要加上 repeatComplete ?
      this.repeating && this.emitter('repeat')

      this.completing && this.emitter('complete')

      return !this.completed
    }
  }
}

export class TweenController extends TweenScheduler {
  private $status: AnimationPlayState = 'idle'

  // animate 开始的时间
  private $startTime = 0

  // animate 当前的时间
  private $currentTime = 0

  // animate 结束的时间
  private $endTime = 0

  public schedule: (timestamp: number) => boolean

  constructor(private renderers: TweenRenderer[], private emitter: Emitter, options: TweenOptions) {
    super(options)

    this.schedule = (timestamp: number) => {
      if (!this.$startTime) this.$startTime = timestamp

      this.$currentTime = timestamp - this.$startTime

      const ratio = super.schedule(this.$currentTime)

      if (isBoolean(ratio)) return !this.completed

      this.starting && this.emitter('start')

      // 修复 duration = Infinity 时的错误
      const adjusted = Number.isNaN(ratio) ? this.$currentTime : ratio * this.duration

      this.renderers.forEach((renderer) => renderer.schedule(adjusted))

      this.emitter('update')

      // TODO: 是否还要加上 repeatComplete ?
      this.repeating && this.emitter('repeat')

      this.completing && this.emitter('complete')

      return !this.completed
    }
  }

  play = () => {
    this.$status = 'running'
    driver.start(this.schedule)
  }

  stop = () => {
    this.$status = 'idle'

    driver.cancel(this.schedule)
  }

  reset = () => {
    this.$status = 'idle'
    // 主要是设置初始值
  }
}
