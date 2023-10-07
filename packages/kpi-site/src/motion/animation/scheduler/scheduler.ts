import { isNullish } from '@kpi/shared'
import clamp from '../../utils/clamp'
import { frameData } from '../driver/delta'

import type { TweenOptions } from '../interface'

export default class TweenScheduler {
  private start = 0

  private delay = 0

  private duration = 0

  private repeat = 0

  private repeatDelay = 0

  private endDelay = 0

  private sliding = [0, 0]

  end: number

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

    this.end = this.delay + this.start + this.duration + cycle + this.endDelay
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

    // 运行次数
    let iteration = Math.floor((second - delay) / (this.repeatDelay + this.duration) || 0)

    iteration = clamp(iteration, 0, this.repeat)

    const done = iteration * (this.repeatDelay + this.duration) || 0

    // 进度
    const ratios = this.sliding
      .map((t) => t - done - delay)
      .map((t) => (t === this.duration ? 1 : t / this.duration))

    // 更新中
    const updating = !(ratios[0] < 0 && ratios[1] < 0) && !(ratios[0] > 1 && ratios[1] > 1)

    // 重复中
    const repeating = iteration > 0 && ratios[0] < 0 && ratios[1] >= 0

    // 开始中
    const starting = first < 0 && second >= 0

    // 结束中
    const completing = first < timeline && second >= timeline

    // 进度
    const progress = clamp(reversed ? 1 - ratios[1] : ratios[1], 0, 1)

    return { starting, completing, updating, repeating, iteration, progress }
  }
}
