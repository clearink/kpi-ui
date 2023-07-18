/* eslint-disable no-return-assign, max-classes-per-file */
import { isBoolean, isNullish } from '@kpi/shared'
import clamp from '../../utils/clamp'
import { defineGetter } from '../../utils/define'
import driver from '../driver'
import { frameData } from '../driver/delta'
import controlledPromise from '../utils/controlled_promise'

import type { Emitter } from '../action/value/utils/emitter'
import type { AnimationStatus, TweenOptions } from '../interface'

const running = (status: AnimationStatus) => status === 'running'
const canceled = (status: AnimationStatus) => status === 'canceled'

export class TweenScheduler {
  start = 0

  // 无论正向还是反向，该属性一直生效
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

  readonly delay!: number

  readonly end!: number

  schedule: (timestamp: number, reversed: boolean) => boolean

  reset: () => void

  emit: Emitter

  constructor(
    emitter: Emitter,
    render: (progress: number, iterations: number) => void,
    options: TweenOptions
  ) {
    const scheduler = new TweenScheduler(options)

    defineGetter(this, 'start', () => scheduler.start)

    defineGetter(this, 'delay', () => scheduler.delay)

    defineGetter(this, 'end', () => scheduler.end)

    this.schedule = (timestamp, reversed) => {
      const progress = scheduler.schedule(timestamp, reversed)
      console.log(progress, timestamp)

      if (isBoolean(progress)) return !scheduler.completed

      scheduler.starting && emitter('start')

      render(clamp(1 - progress, 0, 1), scheduler.iterations)

      emitter('update')

      // TODO: 是否还要加上 repeatComplete ?
      scheduler.repeating && emitter('repeat')

      scheduler.completing && emitter('complete')

      return !scheduler.completing
    }

    this.reset = () => scheduler.reset()

    this.emit = (type) => {
      emitter(type)
    }
  }
}

export class TweenController {
  play: (restart?: boolean) => void

  cancel: () => void

  pause: () => void

  reverse: () => void

  readonly paused!: boolean

  speed: number = 1

  then!: (onfulfilled?: VoidFunction, onrejected?: VoidFunction) => void

  constructor(renderers: TweenRenderer[], options: TweenOptions) {
    // animate 开始的时间
    let $lastUpdate = 0
    // animate 当前的时间
    let $currentTime = 0
    // animate 状态
    let $status: AnimationStatus = 'paused'

    const $promise = controlledPromise()
    $promise.update()

    defineGetter(this, 'then', (onfulfilled?: VoidFunction, onrejected?: VoidFunction) => {
      return $promise.get().then(onfulfilled, onrejected)
    })

    defineGetter(this, 'status', () => $status)

    const scheduler = new TweenScheduler(options)

    const schedule = (timestamp: number) => {
      const elapsed = $lastUpdate ? timestamp - $lastUpdate : 0

      $lastUpdate = timestamp

      $currentTime += elapsed * this.speed

      // 超出范围 or 状态不为 running 停止循环
      if ($currentTime < -frameData.lagged() || !running($status)) return false

      const reversed = this.speed < 0

      const progress = scheduler.schedule($currentTime, reversed)

      if (isBoolean(progress)) return !scheduler.completed

      const adjusted = scheduler.iterations ? progress * scheduler.duration : $currentTime

      renderers.forEach((renderer) => renderer.schedule(adjusted, reversed))

      const shouldContinue = !scheduler.completing

      !shouldContinue && ($status = 'finished')

      return shouldContinue
    }

    const emit: Emitter = (type) => {
      renderers.forEach((renderer) => renderer.emit(type))
    }

    const reset = () => {
      // 重置 sliding
      renderers.forEach((renderer) => renderer.reset())
      scheduler.reset()

      // 重置 time
      $status = 'paused'
      $lastUpdate = 0
      $currentTime = this.speed > 0 ? 0 : scheduler.end + scheduler.delay
    }

    // 运行
    this.play = (restart = false) => {
      if (canceled($status)) return

      if (restart) reset()
      $status = 'running'
      driver.start(schedule)
    }

    this.reverse = () => {
      if (canceled($status)) return

      this.speed *= -1
      this.play(!running($status))
    }

    this.cancel = () => {
      if (canceled($status)) return

      $status = 'canceled'
      emit('cancel')
      driver.cancel(schedule)
      $promise.update(true)
    }

    this.pause = () => {
      if (canceled($status)) return

      $lastUpdate = 0
      $status = 'paused'
      driver.cancel(schedule)
    }
  }
}
