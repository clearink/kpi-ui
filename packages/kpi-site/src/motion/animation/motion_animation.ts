import { shallowMerge } from '@kpi/shared'
import { AnimatableValue, AnimationOptions } from './interface'
import getUnit from '../parse/utils/get_unit'
import { MotionAnimationType } from '../motion/interface'
import { frameData } from '../frame-loop/delta'
import { normalizeEasing } from './utils/normalize'
import { defaultAnimationOptions } from './constant'
import getDecompose from '../parse/utils/get_decompose'
import interpolator from '../utils/interpolator'
import { EasingFunction } from '../tween/interface'

export type MotionAnimation = ReturnType<typeof motionAnimation<AnimatableValue>>

export function motionAnimation<V extends AnimatableValue>(
  from: V,
  to: V,
  options: AnimationOptions & { duration: number; easing: EasingFunction; delay: number }
) {
  const { duration, delay, easing: $easing } = options
  const unit = getUnit(to)

  const easing = normalizeEasing($easing)

  const { numbers: fromNumbers } = getDecompose(from)

  const { numbers: toNumbers, strings: toStrings, numeric } = getDecompose(to)

  const transform = <T extends AnimatableValue>(elapsed: number): T => {
    const mapping = interpolator.bind(null, easing(elapsed / duration), [0, 1])

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
    value: from,
    original: Object.freeze([from, to] as const),
    start: 0,
    delay,
    duration,
    transform,
    get end() {
      return this.start + this.delay + this.duration
    },
  }
}

// 是否应该启动 animation
export function shouldMotion(time: number, animation: MotionAnimation) {
  const { start, delay, end } = animation

  const { delta } = frameData

  return start + delay - delta <= time && time <= end + delta
}
