/* eslint-disable max-classes-per-file */
import { isBoolean } from '@kpi/shared'
import Options from '../../config/options'
import { pushItem } from '../../utils/array'
import driver from '../driver'
import { TweenOptions } from '../interface'

import type { Emitter } from '../action/value/utils/emitter'

export class TweenScheduler {
  protected $start = 0

  protected $delay = 0

  protected $duration = 0

  protected $repeat = 0

  protected $repeatDelay = 0

  protected $repeatType: TweenOptions['repeatType'] = 'loop'

  private $sliding = [-Infinity, -Infinity]

  public get $end() {
    const { $delay, $start, $duration, $repeatDelay, $repeat } = this

    return $delay + $start + $duration + ($repeatDelay + $duration) * $repeat
  }

  private get $whole() {
    return this.$end - this.$start
  }

  private get $ratios() {
    const { $duration, $repeatDelay, $repeat, $sliding } = this

    if (!$duration) return [-Infinity, 1]

    const cycle = $repeatDelay + $duration

    const done = Math.min(Math.floor($sliding[1] / cycle), $repeat) * cycle

    return $sliding.map((elapsed) => (elapsed - done) / $duration)
  }

  get waiting() {
    return this.$sliding[0] < 0 && this.$sliding[1] < 0
  }

  get completed() {
    return this.$sliding[0] >= this.$whole && this.$sliding[1] > this.$whole
  }

  get starting() {
    return this.$sliding[0] < 0 && this.$sliding[1] >= 0
  }

  get repeating() {
    return !this.starting && this.$ratios[0] < 0 && this.$ratios[1] >= 0
  }

  get completing() {
    return this.$sliding[0] < this.$whole && this.$sliding[1] >= this.$whole
  }

  constructor(options: TweenOptions) {
    this.$start = options.start ?? 0

    this.$delay = options.delay ?? 0

    this.$duration = options.duration ?? Options.duration

    this.$repeat = options.repeat ?? 0

    this.$repeatDelay = options.repeatDelay ?? 0

    this.$repeatType = options.repeatType ?? 'loop'
  }

  schedule(timestamp: number): boolean | number {
    const { $start, $delay, $sliding } = this

    const elapsed = timestamp - $start - $delay

    pushItem($sliding, elapsed).shift()

    if (this.waiting || this.completed) return false

    const [pre, now] = this.$ratios

    // repeat delay
    if (pre >= 1 && now > 1) return false

    return now
  }
}

export class TweenRenderer extends TweenScheduler {
  constructor(public emitter: Emitter, render: (progress: number) => void, options: TweenOptions) {
    super(options)

    this.schedule = (timestamp: number) => {
      const progress = super.schedule(timestamp)

      if (isBoolean(progress)) return !this.completed

      this.starting && this.emitter('start')

      this.repeating && this.emitter('repeat')

      render(progress)

      this.emitter('update')

      this.completing && this.emitter('complete')

      return !this.completed
    }
  }
}

export class TweenController extends TweenScheduler {
  private $status: AnimationPlayState = 'idle'

  // animate 开始的时间
  private $startTime = 0

  // animate 结束的时间
  private $endTime = 0

  public schedule: (timestamp: number) => boolean

  constructor(private renderers: TweenRenderer[], private emitter: Emitter, options: TweenOptions) {
    super(options)

    this.schedule = (timestamp: number) => {
      if (!this.$startTime) this.$startTime = timestamp

      const progress = super.schedule(timestamp - this.$startTime)

      if (isBoolean(progress)) return !this.completed

      this.starting && this.emitter('start')

      // TODO: 是否还要加上 repeatComplete ?
      this.repeating && this.emitter('repeat')

      const time = progress * this.$duration

      this.renderers.forEach((renderer) => renderer.schedule(time))

      this.emitter('update')

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
}
