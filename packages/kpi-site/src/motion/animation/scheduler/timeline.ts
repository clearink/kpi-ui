import TweenScheduler from './scheduler'

import type { TweenOptions } from '../interface'

type Update = (progress: number, iteration: number) => void
export default class TweenTimeline {
  scheduler: TweenScheduler

  schedule: (timestamp: number, reversed: boolean) => void

  reset: (reversed: boolean) => void

  constructor(update: Update, options: TweenOptions) {
    this.scheduler = new TweenScheduler(options)

    this.reset = (reversed) => update(+reversed, 0)

    this.schedule = (timestamp, reversed) => {
      const status = this.scheduler.schedule(timestamp, reversed)

      if (status === false) return

      status.starting && options.onStart && options.onStart()

      status.updating && update(status.progress, status.iteration)

      status.repeating && options.onRepeat && options.onRepeat()

      status.completing && options.onComplete && options.onComplete()
    }
  }
}
