/* eslint-disable no-return-assign, max-classes-per-file */
import { isBoolean, isNullish } from '@kpi/shared'
import clamp from '../../utils/clamp'
import { defineProperty } from '../../utils/define'
import driver from '../driver'

import type { Emitter } from '../action/value/utils/emitter'
import type { TweenOptions } from '../interface'

export class TweenScheduler {
  start = 0

  delay = 0

  duration = 0

  repeat = 0

  repeatDelay = 0

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

    return sliding
      .map((timestamp) => timestamp - done)
      .map((time) => (time === dur ? 1 : time / dur))
  }

  get iterations() {
    const { duration, repeatDelay, repeat, sliding } = this

    const count = sliding[1] / (repeatDelay + duration) || 0

    return clamp(Math.floor(count), 0, repeat)
  }

  get waiting() {
    const [first, second] = this.sliding

    return first < 0 && second < 0
  }

  get completed() {
    const [first, second] = this.sliding

    return first >= this.whole && second > this.whole
  }

  get starting() {
    const [first, second] = this.sliding

    return first < 0 && second >= 0
  }

  get repeating() {
    const [first, second] = this.ratios

    return !this.starting && first < 0 && second >= 0
  }

  get completing() {
    const [first, second] = this.sliding

    return first < this.whole && second >= this.whole
  }

  constructor(options: TweenOptions) {
    const { start, delay, duration, repeat, repeatDelay } = options

    // 设置一个足够大的值 防止由于 Infinity 计算出 NaN
    const big = 1e20

    !isNullish(start) && (this.start = clamp(start, 0, big))

    !isNullish(delay) && (this.delay = clamp(delay, 0, big))

    !isNullish(duration) && (this.duration = clamp(duration, 0, big))

    !isNullish(repeat) && (this.repeat = clamp(repeat, 0, big))

    !isNullish(repeatDelay) && (this.repeatDelay = clamp(repeatDelay, 0, big))
  }

  schedule(timestamp: number, reversed: boolean): boolean | number {
    const elapsed = timestamp - this.start - this.delay

    const change = reversed ? 0 : 1
    this.sliding[1 - change] = this.sliding[change]
    this.sliding[change] = elapsed

    if (this.waiting || this.completed) return false

    const [before, current] = this.ratios

    if (before >= 1 && current > 1) return false

    return current
  }
}

export class TweenRenderer {
  readonly start!: number

  readonly end!: number

  schedule: (timestamp: number, reversed: boolean) => boolean

  constructor(
    emitter: Emitter,
    render: (progress: number, iterations: number) => void,
    options: TweenOptions
  ) {
    const scheduler = new TweenScheduler(options)

    defineProperty(this, 'start', { get: () => scheduler.start })

    defineProperty(this, 'end', { get: () => scheduler.end })

    this.schedule = (timestamp: number, reversed: boolean) => {
      const progress = scheduler.schedule(timestamp, reversed)

      if (isBoolean(progress)) return !scheduler.completed

      scheduler.starting && emitter('start')

      render(clamp(progress, 0, 1), scheduler.iterations)

      emitter('update')

      // TODO: 是否还要加上 repeatComplete ?
      scheduler.repeating && emitter('repeat')

      scheduler.completing && emitter('complete')

      return !scheduler.completed
    }
  }
}

export class TweenController {
  play: () => void

  replay: () => void

  stop: () => void

  pause: () => void

  reset: () => void

  speed!: number

  readonly status!: AnimationPlayState

  constructor(renderers: TweenRenderer[], emitter: Emitter, options: TweenOptions) {
    let $status: AnimationPlayState = 'idle'
    // animate 开始的时间
    let $lastUpdate = 0
    // animate 当前的时间
    let $currentTime = 0
    // animate 速度
    let $speed = 1

    const scheduler = new TweenScheduler(options)

    defineProperty(this, 'status', { get: () => $status })

    defineProperty(this, 'speed', {
      get: () => $speed,
      set: (val) => ($speed = val),
    })

    const schedule = (timestamp: number) => {
      const elapsed = $lastUpdate ? timestamp - $lastUpdate : 0

      $lastUpdate = timestamp

      $currentTime += elapsed * $speed

      const reversed = $speed < 0

      const progress = scheduler.schedule($currentTime, reversed)

      if (isBoolean(progress)) return !scheduler.completed

      scheduler.starting && emitter('start')

      const adjusted = scheduler.iterations ? progress * scheduler.duration : $currentTime

      renderers.forEach((renderer) => renderer.schedule(adjusted, reversed))

      emitter('update')

      // TODO: 是否还要加上 repeatComplete ?
      scheduler.repeating && emitter('repeat')

      scheduler.completing && emitter('complete')

      return !scheduler.completed
    }

    this.play = () => {
      $status = 'running'
      driver.start(schedule)
    }

    this.replay = () => {
      $lastUpdate = 0
    }

    this.stop = () => {
      $status = 'idle'
      driver.cancel(schedule)
    }

    this.pause = () => {
      $status = 'idle'
      $lastUpdate = 0

      driver.cancel(schedule)
    }

    this.reset = () => {
      $status = 'idle'
      $lastUpdate = 0
      $currentTime = 0
    }
  }
}
