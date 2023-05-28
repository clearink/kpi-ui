import { toArray } from '@kpi/shared'
import clamp from '../../utils/clamp'
import createTweenGenerator from '../utils/generator'
import { normalizeEasings, normalizeTweenTarget, normalizeTweenTimes } from '../utils/normalize'

import type { AnimatableValue, GenericKeyframes, AnimationOptions } from '../interface'
import type { Tween } from './interface'
import type { MotionValue } from '../../motion'

export default function valueTween<V extends AnimatableValue>(
  motion: MotionValue<V>,
  to: V | GenericKeyframes<V>,
  options: Required<AnimationOptions<V>>
): Tween {
  const { times: $times, easing: $easing, duration: $duration } = options

  const from = motion.get()

  const target = normalizeTweenTarget(from, to)
  // percents
  const times = normalizeTweenTimes(target, $times)

  const easing = normalizeEasings(times.length, toArray($easing))

  const generator = createTweenGenerator(target, times, easing)

  let $start = 0

  return {
    get start() {
      return $start
    },
    set start(start: number) {
      $start = start
    },

    get delay() {
      return options.delay
    },
    get end() {
      return this.delay + this.start + this.duration
    },
    get duration() {
      return $duration
    },
    tick: (time: number) => {
      const elapsed = clamp(time - $start - options.delay, 0, $duration)
      const current = generator(elapsed / $duration)

      motion.set(current)
      // console.log('current', current)

      // change
      motion.notify('change', current)
      options.onChange(current)
      // options event
    },
  }
}
