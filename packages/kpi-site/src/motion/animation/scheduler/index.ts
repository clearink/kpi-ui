/* eslint-disable max-classes-per-file */
import { isNullish } from '@kpi/shared'
import clamp from '../../utils/clamp'
import { defineGetter } from '../../utils/define'
import driver from '../driver'
import { frameData } from '../driver/delta'
import makeControlledPromise from '../utils/controlled_promise'
import { max } from '../utils/math'

import type { Emitter } from '../action/value/utils/emitter'
import type { AnimationStatus, TweenOptions } from '../interface'

const running = (status: AnimationStatus) => status === 'running'

const canceled = (status: AnimationStatus) => status === 'canceled'

const finished = (status: AnimationStatus) => status === 'finished'

export class TweenScheduler {
  private start = 0

  private delay = 0

  private duration = 0

  private repeat = 0

  private repeatDelay = 0

  private endDelay = 0

  private sliding = [0, 0]

  readonly end!: number

  constructor(options: TweenOptions) {
    const { start, duration, repeat, delay, endDelay, repeatDelay } = options

    const maximum = 1e20

    !isNullish(start) && (this.start = clamp(start, 0, maximum))

    !isNullish(delay) && (this.delay = clamp(delay, 0, maximum))

    !isNullish(duration) && (this.duration = clamp(duration, 0, maximum))

    !isNullish(repeat) && (this.repeat = clamp(repeat, 0, maximum))

    !isNullish(repeatDelay) && (this.repeatDelay = clamp(repeatDelay, 0, maximum))

    !isNullish(endDelay) && (this.endDelay = clamp(endDelay, 0, maximum))

    const cycle = (this.repeatDelay + this.duration) * this.repeat || 0

    const end = this.delay + this.start + this.duration + cycle + this.endDelay

    defineGetter(this, 'end', () => end)
  }

  schedule(timestamp: number, reversed: boolean) {
    const elapsed = timestamp - this.start
    const diff = Math.abs(Math.abs(elapsed - this.sliding[1]) - frameData.delta)

    this.sliding[0] = Math.floor(diff) ? elapsed - frameData.delta : this.sliding[1]
    this.sliding[1] = elapsed

    const [first, second] = this.sliding

    const timeline = this.end - this.start

    // 不在时间线内
    if ((first < 0 && second < 0) || (first > timeline && second > timeline)) return false

    const delay = reversed ? this.endDelay : this.delay

    const count = (second - delay) / (this.repeatDelay + this.duration) || 0

    // 运行次数
    const iterations = clamp(Math.floor(count), 0, this.repeat)

    const done = iterations * (this.repeatDelay + this.duration) || 0

    // 进度
    const ratios = this.sliding
      .map((t) => t - done - delay)
      .map((t) => (t === this.duration ? 1 : t / this.duration))

    // 更新中
    const updating = !(ratios[0] < 0 && ratios[1] < 0) && !(ratios[0] > 1 && ratios[1] > 1)

    // 重复中
    const repeating = iterations > 0 && ratios[0] < 0 && ratios[1] >= 0

    // 开始中
    const starting = first < 0 && second >= 0

    // 结束中
    const completing = first < timeline && second >= timeline

    // 进度
    const progress = clamp(reversed ? 1 - ratios[1] : ratios[1], 0, 1)

    return { starting, completing, updating, repeating, iterations, progress }
  }
}

type Update = (progress: number, iterations: number) => void

export class TweenRenderer {
  scheduler: TweenScheduler

  schedule: (timestamp: number, reversed: boolean) => void

  reset: (reversed: boolean) => void

  constructor(emitter: Emitter, update: Update, options: TweenOptions) {
    this.scheduler = new TweenScheduler(options)

    this.reset = (reversed) => emitter('update', update(+reversed, 0))

    this.schedule = (timestamp, reversed) => {
      const status = this.scheduler.schedule(timestamp, reversed)

      if (status === false) return

      status.starting && emitter('start')

      status.updating && emitter('update', update(status.progress, status.iterations))

      status.repeating && emitter('repeat')

      status.completing && emitter('complete')
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

    const $promise = makeControlledPromise()
    $promise.update()

    defineGetter(this, 'then', () => (onfulfilled?: VoidFunction, onrejected?: VoidFunction) => {
      return $promise.get().then(onfulfilled, onrejected)
    })

    const duration = max(renderers.map(({ scheduler }) => scheduler.end))

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

    const reset = () => {
      $lastTime = 0
      $currentTime = this.speed > 0 ? 0 : duration

      // 重置时强行回到原始位置
      renderers.forEach((renderer) => renderer.reset(this.speed < 0))
    }

    // 运行/重新运行
    this.play = (restart = false) => {
      if (canceled($status)) return

      if (restart || finished($status)) reset()

      $status = 'running'

      driver.start(tick)
    }

    // 反转
    this.reverse = () => {
      if (canceled($status)) return

      this.speed *= -1

      this.play()
    }

    // 取消
    this.cancel = () => {
      if (canceled($status)) return

      $status = 'canceled'

      driver.cancel(tick)
    }

    // 暂停
    this.pause = () => {
      if (canceled($status)) return

      $status = 'paused'

      $lastTime = 0

      driver.cancel(tick)
    }
  }
}
