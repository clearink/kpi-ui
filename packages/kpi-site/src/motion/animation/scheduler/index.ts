/* eslint-disable no-return-assign, max-classes-per-file */
import { isBoolean, isNullish } from '@kpi/shared'
import clamp from '../../utils/clamp'
import { defineProperty } from '../../utils/define'
import driver from '../driver'
import { frameData } from '../driver/delta'
import { running } from './status'

import type { Emitter } from '../action/value/utils/emitter'
import type { TweenOptions } from '../interface'

export class TweenScheduler {
  start = 0

  delay = 0

  duration = 0

  repeat = 0

  repeatDelay = 0

  reversed = false

  sliding: number[] = [-Infinity, -Infinity]

  get end() {
    const { delay, start, duration, repeatDelay, repeat } = this

    const cycle = (repeatDelay + duration) * repeat || 0

    return delay + start + duration + cycle
  }

  get whole() {
    return this.end - this.start - this.delay
  }

  get ratios() {
    const { duration: dur, repeatDelay, sliding } = this

    const done = this.iterations * (repeatDelay + dur) || 0

    return sliding.map((t) => (t - done === dur ? 1 : (t - done) / dur))
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

    return !this.starting && !this.completing && first < 0 && second >= 0
  }

  get completing() {
    const [first, second] = this.sliding

    if (this.reversed) return first < 0 && second >= 0

    return first < this.whole && second >= this.whole
  }

  constructor(options: TweenOptions) {
    const { start, delay, duration, repeat, repeatDelay } = options

    const big = 1e20

    !isNullish(start) && (this.start = clamp(start, 0, big))

    !isNullish(delay) && (this.delay = clamp(delay, 0, big))

    !isNullish(duration) && (this.duration = clamp(duration, 0, big))

    !isNullish(repeat) && (this.repeat = clamp(repeat, 0, big))

    !isNullish(repeatDelay) && (this.repeatDelay = clamp(repeatDelay, 0, big))
  }

  schedule(timestamp: number, reversed: boolean): boolean | number {
    const factor = reversed ? 1 : -1
    const change = reversed ? 0 : 1

    const prev = this.sliding[change]
    this.sliding[1 - change] = Math.abs(prev) === Infinity ? factor * Infinity : prev
    this.sliding[change] = timestamp - this.start - this.delay

    this.reversed = reversed

    if (this.waiting || this.completed) return false

    const [before, current] = this.ratios

    if (before >= 1 && current > 1) return false

    return reversed ? before : current
  }

  reset() {
    this.sliding = [-Infinity, -Infinity]
  }
}

export class TweenRenderer {
  readonly start!: number

  readonly end!: number

  schedule: (timestamp: number, reversed: boolean) => boolean

  reset: () => void

  constructor(
    emitter: Emitter,
    render: (progress: number, iterations: number) => void,
    options: TweenOptions
  ) {
    const scheduler = new TweenScheduler(options)

    defineProperty(this, 'start', { get: () => scheduler.start })

    defineProperty(this, 'end', { get: () => scheduler.end })

    this.schedule = (timestamp, reversed) => {
      const progress = scheduler.schedule(timestamp, reversed)

      if (isBoolean(progress)) return !scheduler.completed

      scheduler.starting && emitter('start')

      render(clamp(progress, 0, 1), scheduler.iterations)

      emitter('update')

      // TODO: 是否还要加上 repeatComplete ?
      scheduler.repeating && emitter('repeat')

      scheduler.completing && emitter('complete')

      return !scheduler.completing
    }

    this.reset = () => scheduler.reset()
  }
}

export class TweenController {
  play: () => void

  replay: () => void

  stop: () => void

  pause: () => void

  reset: () => void

  reverse: () => void

  speed: number = 1

  constructor(renderers: TweenRenderer[], emitter: Emitter, options: TweenOptions) {
    // animate 开始的时间
    let $lastUpdate = 0
    // animate 当前的时间
    let $currentTime = 0
    // 是否暂停
    const $paused = false

    const scheduler = new TweenScheduler(options)

    const schedule = (timestamp: number) => {
      const elapsed = $lastUpdate ? timestamp - $lastUpdate : 0

      $lastUpdate = timestamp

      $currentTime += elapsed * this.speed

      const reversed = this.speed < 0

      if ($currentTime < -frameData.delta * 2) return false

      const progress = scheduler.schedule($currentTime, reversed)

      if (isBoolean(progress)) return !scheduler.completed

      scheduler.starting && emitter('start')

      const adjusted = scheduler.iterations ? progress * scheduler.duration : $currentTime

      renderers.forEach((renderer) => renderer.schedule(adjusted, reversed))

      emitter('update')

      // TODO: 是否还要加上 repeatComplete ?
      scheduler.repeating && emitter('repeat')

      scheduler.completing && emitter('complete')

      const shouldContinue = !scheduler.completing

      return shouldContinue
    }

    this.reset = () => {
      // 重置 sliding
      scheduler.reset()
      renderers.forEach((renderer) => renderer.reset())

      $lastUpdate = 0

      // 重置$currentTime
      $currentTime = this.speed > 0 ? 0 : scheduler.end
    }

    this.play = () => {
      driver.start(schedule)
    }

    this.reverse = () => {
      this.speed = -this.speed

      $paused && this.reset()

      this.play()
    }

    this.replay = () => {
      $lastUpdate = 0
    }

    this.stop = () => {
      driver.cancel(schedule)
    }

    this.pause = () => {
      $lastUpdate = 0

      driver.cancel(schedule)
    }
  }
}
