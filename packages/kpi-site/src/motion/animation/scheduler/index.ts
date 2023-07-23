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

    // TODO: 改这里
    const count = (time - delay) / (repeatDelay + duration) || 0

    return clamp(Math.floor(count), 0, repeat)
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

  running(timestamp: number) {
    const lagged = frameData.lagged()

    return timestamp + lagged >= this.start && timestamp - lagged <= this.end
  }

  schedule(timestamp: number, reversed: boolean) {
    const factor = reversed ? 1 : -1
    const change = reversed ? 0 : 1

    const pre = this.sliding[change]
    this.sliding[1 - change] = Math.abs(pre) === Infinity ? factor * Infinity : pre
    this.sliding[change] = timestamp - this.start

    const diff = this.sliding[1] - this.sliding[0]

    // 更改方向了,需要调整sliding
    // 是否需要?
    if (this.reversed !== reversed && diff >= frameData.lagged()) {
      this.sliding[1 - change] = this.sliding[change] + factor * frameData.delta
    }

    this.reversed = reversed

    return clamp(this.ratios[change], 0, 1)
  }
}

export class TweenRenderer {
  readonly scheduler!: TweenScheduler

  schedule: (timestamp: number, reversed: boolean) => void

  reset: (reversed: boolean) => void

  constructor(
    emitter: Emitter,
    render: (progress: number, iterations: number) => void,
    options: TweenOptions
  ) {
    const scheduler = new TweenScheduler(options)

    defineGetter(this, 'scheduler', () => scheduler)

    this.schedule = (timestamp, reversed) => {
      // 未到 animation 运行时间
      if (!scheduler.running(timestamp)) return

      const progress = scheduler.schedule(timestamp, reversed)

      console.log(progress, timestamp)

      scheduler.starting && emitter('start')

      scheduler.updating && render(progress, scheduler.iterations)

      scheduler.updating && emitter('update')

      // TODO: 是否还要加上 repeatComplete ?
      scheduler.repeating && emitter('repeat')

      scheduler.completing && emitter('complete')
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
      if (!running($status)) return false

      const elapsed = $lastUpdate ? timestamp - $lastUpdate : 0

      $lastUpdate = timestamp

      $currentTime += elapsed * this.speed

      const lagged = frameData.lagged()

      if ($currentTime + lagged <= 0) return false

      const reversed = this.speed < 0

      renderers.forEach((renderer) => renderer.schedule($currentTime, reversed))

      if ($currentTime - lagged <= duration) return true

      // 触发事件是否应当放到 renderer 中?
      // // 更改状态
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
      console.log($currentTime, duration - $currentTime)
      $currentTime = duration - $currentTime
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

/**
 * 根据 web animations api 的分析, 其生命周期如下
 * 1. start---delay---update--endDelay--finish
 *
 *
 * Q: controller 是否需要创建一个 scheduler ?
 */
