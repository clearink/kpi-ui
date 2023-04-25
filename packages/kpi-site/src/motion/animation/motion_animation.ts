/* eslint-disable no-return-assign */
import { isNull, toArray } from '@kpi/shared'
import getUnit from '../parse/utils/get_unit'
import { frameData } from '../frame-loop/delta'
import { normalizeEasing } from './utils/normalize'
import getDecompose from '../parse/utils/get_decompose'
import interpolator from '../utils/interpolator'

import type { MotionAnimationType } from '../motion/interface'
import type { AnimatableValue, GenericKeyframes, MergedAnimationOptions } from './interface'
import { pushItem } from '../utils/array'

export type MotionAnimation = ReturnType<typeof motionAnimation<AnimatableValue>>

export function motionAnimation<V extends AnimatableValue>(
  from: V,
  to: V,
  options: MergedAnimationOptions
) {
  const { easing: $easing } = options

  let $duration = options.duration
  let $start = 0
  let $delay = options.delay

  const unit = getUnit(to)

  const easing = normalizeEasing($easing)

  const { numbers: fromNumbers } = getDecompose(from)

  const { numbers: toNumbers, strings: toStrings, numeric } = getDecompose(to)

  const transform = <T extends AnimatableValue>(elapsed: number): T => {
    const mapping = interpolator.bind(null, easing(elapsed / $duration), [0, 1])

    const numbers = toNumbers.map((num, i) => mapping([fromNumbers[i], num]))

    if (numeric) return numbers[0] as T

    return toStrings.reduce((result, str, i) => {
      return `${result}${str}${numbers[i] ?? ''}`
    }, '') as T
  }

  return {
    type: 'value' as MotionAnimationType,
    property: undefined as string | undefined,
    unit,
    original: Object.freeze([from, to] as const),

    get delay() {
      return $delay
    },
    // TODO: 是否需要该 setter ?
    set delay(delay: number) {
      $delay = delay
    },

    get start() {
      return $start
    },
    set start(start: number) {
      $start = start
    },

    get duration() {
      return $duration
    },
    set duration(duration: number) {
      $duration = duration
    },

    get end() {
      return this.start + this.delay + this.duration
    },

    transform,
  }
}

// 是否应该启动 animation
export function shouldMotion(time: number, animation: MotionAnimation) {
  const { start, delay, end } = animation

  const { delta } = frameData

  return start + delay - delta <= time && time <= end + delta
}

export function makeMotionAnimations<V extends AnimatableValue>(
  from: V,
  to: V | GenericKeyframes<V>[number][],
  options: MergedAnimationOptions<V>
): MotionAnimation[] {
  const tos = toArray(to).map((item, i) => {
    if (i === 0 && isNull(item)) return from
    return item as V
  })

  return tos.reduce<MotionAnimation[]>((animations, item, i) => {
    if (i === 0) return animations

    const lastAnimation = animations[animations.length - 1]

    const nextFrom = lastAnimation ? lastAnimation.original[1] : tos[i - 1]

    const animation = motionAnimation(nextFrom, item, options)

    animation.duration = options.duration / tos.length

    if (i > 1) animation.start = lastAnimation.end

    return pushItem(animations, animation)
  }, [])
}
