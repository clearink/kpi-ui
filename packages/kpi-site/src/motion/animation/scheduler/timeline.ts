import TweenScheduler from './scheduler'

import type { TweenOptions } from '../interface'
import { Emitter } from '../action/value/utils/emitter'

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

// this.schedule = (timestamp, reversed) => {
//   const status = this.scheduler.schedule(timestamp, reversed)

//   if (status === false) return

//   let { progress } = status

//   const odd = status.iteration % 2 === 1

//   const backward = options.repeatType === 'mirror' && odd

//   if (options.repeatType === 'reverse' && odd) progress = 1 - progress

//   const active = times.findIndex((time, i) => progress < time || i === steps - 1)

//   const range: [number, number] = [times[active - 1], times[active]]

//   const easing = easings[backward ? steps - active : active - 1]

//   if (backward) range.reverse()

//   const [percent, transform] = interpolator(progress, range, [0, 1])

//   const animation = animations[backward ? steps - active : active - 1]

//   animation.render(transform(easing(percent)))
// }

/**
 * 对于 duration= 3000, easing=['easeInBack', 'linear'] times = [0, 0.4, 1], keyframes = [0, 100, 300]
 *
 * scheduler 计算出的 progress in [0, 1]
 * 将生成 2 个 TweenAnimation
 * TweenAnimation<0, 100> progress in [0, 0.4] easing = 'easeInBack'
 * TweenAnimation<100, 300> progress in [0.4, 1] easing = 'linear'
 *
 * 故: 在 TweenTimeline 中需要获取真正的 range, easing
 *
 *
 * ******************** repeatType = 'mirror' && iteration % 2 === 1 时********************
 * active === 0
 * range = [0, 0.4] => [0.4, 0](反转一下)
 * easing = easings[active] = 'easeInBack'
 * animation = animations[animations.length - 1 - active] = TweenAnimation<100, 300>
 * progress = progress
 *
 * active === 1
 * range = [0.6, 1] => [1, 0.6](反转一下)
 * easing = easings[active] = 'linear'
 * animation = animations[animations.length - 1 - active] = TweenAnimation<0, 100>
 * */

/**
 *    if (status.iteration % 2 === 0 || options.repeatType === 'loop') {
        // 正常情况下
        const active = 0 // TODO: 如何获取当前 active ?
        const easing = easings[active - 1]
        const range: [number, number] = [times[active - 1], times[active]]

        const [percent, transform] = interpolator(status.progress, range, [0, 1])
        const animation = animations[active - 1]
        animation.render(transform(easing(percent)))
      } else if (options.repeatType === 'reverse') {
        // 需要调整 progress
        const adjusted = 1 - status.progress
        const active = 0 // TODO: 如何获取当前 active
        const easing = easings[active - 1]
        const range: [number, number] = [times[active - 1], times[active]]

        const [percent, transform] = interpolator(adjusted, range, [0, 1])
        const animation = animations[active - 1]
        animation.render(transform(easing(percent)))
      } else if (options.repeatType === 'mirror') {
        //
        const active = 0
        const easing = easings[active - 1]
        const range: [number, number] = [times[active], times[active - 1]]

        const [percent, transform] = interpolator(status.progress, range, [0, 1])

        const animation = animations[steps - 1 - active]
        animation.render(transform(easing(percent)))
      }
 */
