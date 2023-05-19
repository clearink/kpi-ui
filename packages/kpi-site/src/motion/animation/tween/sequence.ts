import { getUnit } from '../../parse/utils/getters'
import clamp from '../../utils/clamp'
import { normalizeEasing, normalizeTweenTarget, normalizeTweenTimes } from '../utils/normalize'
import { createTweenGenerator } from '../utils/generator'

import type { AnimatableValue, GenericKeyframes, AnimationOptions } from '../interface'
import type { ValueTween } from './interface'
import type { MotionValue } from '../../motion'

export default function valueTween<V extends AnimatableValue>(
  motion: MotionValue<V>,
  to: V | GenericKeyframes<V>,
  options: Required<AnimationOptions<V>>
): ValueTween {
  const { times: $times, easing: $easing, duration: $duration } = options

  const from = motion.get()

  const $unit = getUnit(from)
  // TODO: 单位转换
  const target = normalizeTweenTarget(from, to)
  // percents
  const times = normalizeTweenTimes(target, $times)

  const easing = normalizeEasing($easing)

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
