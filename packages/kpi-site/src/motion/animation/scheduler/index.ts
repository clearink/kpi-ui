/* eslint-disable max-classes-per-file */
import { isBoolean, isNullish } from '@kpi/shared'
import clamp from '../../utils/clamp'
import driver from '../driver'
import { TweenOptions } from '../interface'

import type { Emitter } from '../action/value/utils/emitter'

export class TweenScheduler {
  start = 0

  delay = 0

  duration = 0

  reversed = !false

  repeat = 0

  repeatDelay = 0

  get end() {
    const { delay, start, duration, repeatDelay, repeat } = this

    const cycle = (repeatDelay + duration) * repeat || 0

    return delay + start + duration + cycle
  }

  protected get whole() {
    return this.end - this.start - this.delay
  }

  protected sliding: number[] = [-Infinity, -Infinity]

  protected get ratios() {
    const { duration, repeatDelay, sliding, reversed } = this

    const done = this.iterations * (repeatDelay + duration) || 0

    // 添加一个足够小的数字避免 NaN 的出现
    const min = reversed ? -1e-99 : 1e-99

    return sliding.map((elapsed) => (elapsed - done + min) / duration)
  }

  get iterations() {
    const { duration, repeatDelay, repeat, sliding } = this

    const count = sliding[1] / (repeatDelay + duration) || 0

    return clamp(Math.floor(count), 0, repeat)
  }

  get waiting() {
    const [first, second] = this.sliding

    if (this.reversed) return first >= this.whole && second > this.whole

    return first < 0 && second < 0
  }

  get completed() {
    const [first, second] = this.sliding

    if (this.reversed) return first < 0 && second < 0

    return first >= this.whole && second > this.whole
  }

  get starting() {
    const [first, second] = this.sliding

    if (this.reversed) return first < this.whole && second >= this.whole

    return first < 0 && second >= 0
  }

  get repeating() {
    const [first, second] = this.ratios

    if (this.starting) return false

    if (this.reversed) return first < 1 && second >= 1

    return first < 0 && second >= 0
  }

  get completing() {
    const [first, second] = this.sliding

    if (this.reversed) return first < 0 && second >= 0

    return first < this.whole && second >= this.whole
  }

  constructor(options: TweenOptions) {
    const { start, delay, duration, repeat, repeatDelay } = options

    !isNullish(start) && (this.start = start)

    !isNullish(delay) && (this.delay = delay)

    !isNullish(duration) && (this.duration = duration)

    !isNullish(repeat) && (this.repeat = repeat)

    !isNullish(repeatDelay) && (this.repeatDelay = repeatDelay)

    const factor = this.reversed ? -1 : 1

    this.sliding = this.sliding.map((time) => time * factor)
  }

  schedule(timestamp: number): boolean | number {
    let elapsed = timestamp - this.start - this.delay

    if (this.reversed) elapsed = this.whole - elapsed || 0

    const change = this.reversed ? 0 : 1
    this.sliding[1 - change] = this.sliding[change]
    this.sliding[change] = elapsed

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
    render: (progress: number, iterations: number) => void,
    options: TweenOptions
  ) {
    super(options)

    this.schedule = (timestamp: number) => {
      const progress = super.schedule(timestamp)

      if (isBoolean(progress)) return !this.completed

      this.starting && this.emitter('start')

      render(clamp(progress, 0, 1), this.iterations)

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
  private $updateTime = 0

  // animate 最后的时间
  private $lastTime = 0

  public schedule: (timestamp: number) => boolean

  // TODO: 添加 renderer 实现 repeat 功能
  constructor(private renderers: TweenRenderer[], private emitter: Emitter, options: TweenOptions) {
    super(options)

    this.schedule = (timestamp: number) => {
      if (!this.$startTime) this.$startTime = timestamp

      this.$updateTime = timestamp - this.$startTime + this.$lastTime

      const progress = super.schedule(this.$updateTime)

      if (isBoolean(progress)) return !this.completed

      this.starting && this.emitter('start')

      let adjusted = this.reversed ? this.whole - this.$updateTime || 0 : this.$updateTime
      if (this.iterations) adjusted = (this.reversed ? 1 - progress : progress) * this.duration

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

  pause = () => {
    this.$status = 'idle'

    this.$lastTime = this.$updateTime
    this.$startTime = 0
    driver.cancel(this.schedule)
  }

  reset = () => {
    this.$status = 'idle'
    // 主要是设置初始值
  }

  reverse = () => {
    this.reversed = !this.reversed
    this.$startTime = 0
    this.$lastTime = this.whole - this.$updateTime
    this.play()
  }
}

/**
 * emitter 逻辑无论是正向还是反向都非常正确（是否需要加上 reversed 标识？）
 *
 * controller 的 $updateTime 计算不准确
 */
