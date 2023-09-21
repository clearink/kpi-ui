import TweenScheduler from './scheduler'

import type { Emitter } from '../action/value/emitter'
import type { TweenOptions } from '../interface'

type Update = (progress: number, iteration: number) => void
export default class TweenTimeline {
  scheduler: TweenScheduler

  schedule: (timestamp: number, reversed: boolean) => void

  reset: (reversed: boolean) => void

  constructor(emitter: Emitter, update: Update, options: TweenOptions) {
    this.scheduler = new TweenScheduler(options)

    this.reset = (reversed) => update(+reversed, 0)

    this.schedule = (timestamp, reversed) => {
      const status = this.scheduler.schedule(timestamp, reversed)

      if (status === false) return

      status.starting && emitter('start')

      status.updating && update(status.progress, status.iteration)

      status.repeating && emitter('repeat')

      status.completing && emitter('complete')
    }
  }
}
