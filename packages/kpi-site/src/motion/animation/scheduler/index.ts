/* eslint-disable no-return-assign, max-classes-per-file */
import { isNullish } from '@kpi/shared'
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
    const { duration, repeatDelay, sliding, delay, endDelay, reversed } = this

    const done = this.iterations * (repeatDelay + duration) || 0

    return sliding
      .map((t) => t - done - (reversed ? endDelay : delay))
      .map((t) => (t === duration ? 1 : t / duration))
  }

  get iterations() {
    const { duration, repeat, repeatDelay, sliding, reversed, delay, endDelay } = this

    const count = (sliding[1] - (reversed ? endDelay : delay)) / (repeatDelay + duration) || 0

    return clamp(Math.floor(count), 0, repeat)
  }

  get starting() {
    const { sliding } = this

    return sliding[0] < 0 && sliding[1] >= 0
  }

  get running() {
    const [first, second] = this.sliding

    return !(first < 0 && second < 0) && !(first > this.whole && first > this.whole)
  }

  get completing() {
    const [first, second] = this.sliding

    const time = this.whole

    return first < time && second >= time
  }

  get updating() {
    const [first, second] = this.ratios

    return !(first < 0 && second < 0) && !(first > 1 && first > 1)
  }

  get repeating() {
    const { ratios, iterations } = this

    return iterations && ratios[0] < 0 && ratios[1] >= 0
  }

  constructor(options: TweenOptions) {
    const { start, duration, repeat, delay, endDelay, repeatDelay } = options

    const maximum = 1e20

    !isNullish(start) && (this.start = clamp(start, 0, maximum))

    !isNullish(duration) && (this.duration = clamp(duration, 0, maximum))

    !isNullish(repeat) && (this.repeat = clamp(repeat, 0, maximum))

    !isNullish(delay) && (this.delay = clamp(delay, 0, maximum))

    !isNullish(delay) && (this.delay = clamp(delay, 0, maximum))

    !isNullish(endDelay) && (this.endDelay = clamp(endDelay, 0, maximum))

    !isNullish(repeatDelay) && (this.repeatDelay = clamp(repeatDelay, 0, maximum))
  }

  schedule(timestamp: number, reversed: boolean) {
    const elapsed = timestamp - this.start
    const diff = Math.abs(Math.abs(elapsed - this.sliding[1]) - frameData.delta)

    this.sliding[0] = Math.floor(diff) ? elapsed - frameData.delta : this.sliding[1]
    this.sliding[1] = elapsed

    this.reversed = reversed

    if (this.running) return false

    return clamp(reversed ? 1 - this.ratios[1] : this.ratios[1], 0, 1)
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
      const progress = scheduler.schedule(timestamp, reversed)

      if (progress === false) return false

      scheduler.starting && emitter('start')

      scheduler.updating && emitter('update', render(progress, scheduler.iterations))

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

  speed = 1

  play: (restart?: boolean) => void

  cancel: () => void

  pause: () => void

  reverse: () => void

  then!: (onfulfilled?: VoidFunction, onrejected?: VoidFunction) => Promise<void>

  constructor(renderers: TweenRenderer[]) {
    // animation 上次更新的时间
    let $lastTime = 0
    // animation 当前的时间
    let $currentTime = 0
    // animation 状态
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
      $lastTime = 0
      $currentTime = this.speed > 0 ? 0 : duration

      // 重置 renderer 状态
      renderers.forEach((renderer) => renderer.reset(this.speed < 0))
    }

    // 初始化数据
    // TODO: 初始时是否应该调用 reset 函数？
    reset()

    const tick = (timestamp: number) => {
      if (!running($status)) return false

      const elapsed = $lastTime ? timestamp - $lastTime : 0

      $lastTime = timestamp

      $currentTime += elapsed * this.speed

      const reversed = this.speed < 0

      const adjusted = reversed ? duration - $currentTime : $currentTime

      renderers.forEach((renderer) => renderer.schedule(adjusted, reversed))

      if (adjusted < duration) return true

      $status = 'finished'

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

      driver.cancel(tick)
    }

    this.pause = () => {
      if (canceled($status)) return

      $status = 'paused'

      $lastTime = 0

      driver.cancel(tick)
    }
  }
}
