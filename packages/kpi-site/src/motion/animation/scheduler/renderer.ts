import TweenScheduler from './scheduler'

import type { Emitter } from '../action/value/utils/emitter'
import type { TweenOptions } from '../interface'

type Update = (progress: number, iterations: number) => void

/* 
  TODO: 现在主要是对 TweenRenderer 进行改造， 但是我还没有想到一个很好的办法
  首先肯定会有一个 init 方法，用来获取 [from, to] 的值
  其次，会将 motionValue 传进来
*/

export default class TweenRenderer {
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

      status.updating && emitter('update', update(status.progress, status.iteration))

      status.repeating && emitter('repeat')

      status.completing && emitter('complete')
    }
  }
}
