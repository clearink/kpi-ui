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

  endDelay = 0

  duration = 0

  repeat = 0

  repeatDelay = 0

  reversed = false

  sliding: number[] = [-Infinity, -Infinity]

  get end() {
    const { delay, start, duration, repeatDelay, repeat, endDelay } = this

    const cycle = (repeatDelay + duration) * repeat || 0

    return delay + start + duration + cycle + endDelay
  }

  get whole() {
    return this.end - this.start
  }

  get ratios() {
    const { duration, repeatDelay, sliding, delay } = this

    const done = this.iterations * (repeatDelay + duration) || 0

    // TODO: 改这里
    return sliding.map((t) => t - done - delay).map((t) => (t === duration ? 1 : t / duration))
  }

  get iterations() {
    const { duration, repeatDelay, repeat, sliding, reversed, delay } = this

    const time = reversed ? sliding[0] : sliding[1]

    const count = (time - delay) / (repeatDelay + duration) || 0

    return clamp(Math.floor(count), 0, repeat)
  }

  get running() {
    const [first, second] = this.sliding

    const time = this.whole

    return !(first < 0 && second < 0) && !(first > time && second > time)
  }

  get updating() {
    const [first, second] = this.ratios

    return !(first < 0 && second < 0) && !(first > 1 && first > 1)
  }

  get completed() {
    const [first, second] = this.sliding

    const time = this.reversed ? 0 : this.whole

    if (this.reversed) return first < time && second < time

    return first > time && second > time
  }

  get starting() {
    const [first, second] = this.sliding

    const time = this.reversed ? this.whole : 0

    return first < time && second >= time
  }

  // TODO: 改这里
  get repeating() {
    const [first, second] = this.ratios

    if (this.iterations === 0) return false

    return first < 0 && second >= 0
  }

  get completing() {
    const [first, second] = this.sliding

    const time = this.reversed ? 0 : this.whole

    return first < time && second >= time
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

    if (!this.running) return false

    return this.ratios[change]
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

      if (isBoolean(progress)) return !scheduler.completed

      scheduler.starting && emitter('start')

      scheduler.updating && render(clamp(progress, 0, 1), scheduler.iterations)

      scheduler.updating && emitter('update')

      // TODO: 是否还要加上 repeatComplete ?
      scheduler.repeating && emitter('repeat')
      console.log(scheduler.ratios)

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

  then!: (onfulfilled?: VoidFunction, onrejected?: VoidFunction) => Promise<void>

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
