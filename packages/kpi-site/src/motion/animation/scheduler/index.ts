/* eslint-disable no-return-assign, max-classes-per-file */
import { isBoolean, isNullish } from '@kpi/shared'
import clamp from '../../utils/clamp'
import { defineGetter } from '../../utils/define'
import driver from '../driver'
import { frameData } from '../driver/delta'
import controlledPromise from '../utils/controlled_promise'
import { max } from '../utils/math'

import type { Emitter } from '../action/value/utils/emitter'
import type { AnimationStatus, TweenOptions } from '../interface'

const running = (status: AnimationStatus) => status === 'running'

const canceled = (status: AnimationStatus) => status === 'canceled'

const finished = (status: AnimationStatus) => status === 'finished'

export class TweenScheduler {
  start = 0

  // 准确来说应该是 startDelay
  delay = 0

  endDelay = 2000

  duration = 0

  repeat = 0

  repeatDelay = 0

  reversed = false

  sliding: number[] = [-Infinity, -Infinity]

  get end() {
    const { delay, start, duration, repeatDelay, repeat } = this

    const cycle = (repeatDelay + duration) * repeat || 0

    return delay + start + duration + cycle + this.endDelay
  }

  // TODO: 改这里
  get updateTimeline() {
    const { duration, repeatDelay, repeat } = this

    return duration + ((repeatDelay + duration) * repeat || 0)
  }

  // TODO: 改这里
  get wholeTimeline() {
    return this.delay + this.updateTimeline + this.endDelay
  }

  // TODO: 改这里
  get ratios() {
    const { duration: dur, repeatDelay, sliding } = this

    const done = this.iterations * (repeatDelay + dur) || 0

    return sliding.map((t) => (t - done === dur ? 1 : (t - done) / dur))
  }

  // TODO: 改这里
  get iterations() {
    const { duration, repeatDelay, repeat, sliding } = this

    const count = sliding[1] / (repeatDelay + duration) || 0

    return clamp(Math.floor(count), 0, repeat)
  }

  get waiting() {
    const [first, second] = this.sliding

    if (this.reversed) return first >= this.wholeTimeline && second > this.wholeTimeline

    return first < 0 && second < 0
  }

  get completed() {
    const [first, second] = this.sliding

    if (this.reversed) return first < 0 && second < 0

    return first >= this.wholeTimeline && second > this.wholeTimeline
  }

  get starting() {
    const [first, second] = this.sliding

    if (this.reversed) return first < this.wholeTimeline && second >= this.wholeTimeline

    return first < 0 && second >= 0
  }

  get repeating() {
    const [first, second] = this.ratios

    return !this.starting && !this.completing && first < 0 && second >= 0
  }

  get completing() {
    const [first, second] = this.sliding

    if (this.reversed) return first < 0 && second >= 0

    return first < this.wholeTimeline && second >= this.wholeTimeline
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

  schedule(timestamp: number, reversed: boolean) {
    const factor = reversed ? 1 : -1
    const change = reversed ? 0 : 1

    const pre = this.sliding[change]
    this.sliding[1 - change] = Math.abs(pre) === Infinity ? factor * Infinity : pre
    this.sliding[change] = timestamp - this.start

    this.reversed = reversed

    // 超出范围
    if (this.waiting || this.completed) return false

    const [before, current] = this.ratios

    if (before >= 1 && current > 1) return false

    return reversed ? before : current
  }
}

export class TweenRenderer {
  readonly scheduler!: TweenScheduler

  schedule: (timestamp: number, reversed: boolean) => boolean

  reset: (reversed: boolean) => void

  constructor(
    emitter: Emitter,
    render: (progress: number, iterations: number) => void,
    options: TweenOptions
  ) {
    const scheduler = new TweenScheduler(options)

    defineGetter(this, 'scheduler', () => scheduler)

    this.schedule = (timestamp, reversed) => {
      const progress = scheduler.schedule(timestamp, reversed)

      console.log(progress, scheduler.sliding)
      if (isBoolean(progress)) return !scheduler.completed

      scheduler.starting && emitter('start')

      render(clamp(progress, 0, 1), scheduler.iterations)

      emitter('update')

      // TODO: 是否还要加上 repeatComplete ?
      scheduler.repeating && emitter('repeat')

      scheduler.completing && emitter('complete')

      return !scheduler.completing
    }

    this.reset = (reversed) => {
      scheduler.sliding = [-Infinity, -Infinity]

      emitter('update', render(+reversed, 0))
    }
  }
}

export class TweenController {
  readonly status!: AnimationStatus

  speed: number = 1

  play: (restart?: boolean) => void

  cancel: () => void

  pause: () => void

  reverse: () => void

  then!: (onfulfilled?: VoidFunction, onrejected?: VoidFunction) => void

  constructor(renderers: TweenRenderer[]) {
    // animate 开始的时间
    let $lastUpdate = 0
    // animate 当前的时间
    let $currentTime = 0
    // animate 状态
    let $status: AnimationStatus = 'paused'

    defineGetter(this, 'status', () => $status)

    const $promise = controlledPromise()
    $promise.update()

    defineGetter(this, 'then', () => (onfulfilled?: VoidFunction, onrejected?: VoidFunction) => {
      return $promise.get().then(onfulfilled, onrejected)
    })

    const duration = max(renderers.map(({ scheduler }) => scheduler.end))

    const scheduler = new TweenScheduler({ start: 0, duration })

    const reset = () => {
      // 重置 time
      $status = 'paused'
      $lastUpdate = 0
      $currentTime = this.speed > 0 ? 0 : duration

      // 重置 renderer 状态
      renderers.forEach((renderer) => renderer.reset(this.speed < 0))
    }

    // 初始化数据
    // TODO: 初始时是否应该调用 reset 函数？
    reset()

    const tick = (timestamp: number) => {
      const elapsed = $lastUpdate ? timestamp - $lastUpdate : 0

      $lastUpdate = timestamp

      $currentTime += elapsed * this.speed

      if ($currentTime < -frameData.lagged() || !running($status)) return false

      const reversed = this.speed < 0

      const progress = scheduler.schedule($currentTime, reversed)

      if (isBoolean(progress)) return !scheduler.completed

      renderers.forEach((renderer) => renderer.schedule($currentTime, reversed))

      const shouldContinue = !scheduler.completing

      if (shouldContinue) return true

      // 更改状态
      $status = 'finished'

      // 触发 promise 回调
      $promise.update()

      return false
    }

    // 运行
    this.play = (restart = false) => {
      if (canceled($status)) return

      if (restart || finished($status)) reset()
      $status = 'running'
      driver.start(tick)
    }

    this.reverse = () => {
      if (canceled($status)) return

      this.speed *= -1
      this.play(!running($status))
    }

    this.cancel = () => {
      if (canceled($status)) return

      $status = 'canceled'

      // emit('cancel')

      driver.cancel(tick)
    }

    this.pause = () => {
      if (canceled($status)) return

      $lastUpdate = 0
      $status = 'paused'
      driver.cancel(tick)
    }
  }
}
