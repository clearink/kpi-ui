/* eslint-disable no-return-assign */
import { isArray, isNull } from '@kpi/shared'
import getUnit from '../../parse/utils/get_unit'
import { normalizeEasing } from '../utils/normalize'
import getDecompose from '../../parse/utils/get_decompose'
import interpolator from '../../utils/interpolator'
import { pushItem } from '../../utils/array'

import type { AnimatableValue, GenericKeyframes, MergedAnimationOptions } from '../interface'
import type {
  MotionTween,
  MotionTweenType,
  MotionValueTween,
  MotionElementTween,
} from './interface'
import defineHidden from '../../utils/define_hidden'

export function motionAnimation<V extends AnimatableValue>(
  from: V,
  to: V,
  options: MergedAnimationOptions
): MotionTween<V> {
  const { easing: $easing } = options

  let $duration = options.duration
  let $start = 0

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
    type: 'value',

    get unit() {
      return unit
    },

    original: [from, to],

    get delay() {
      return options.delay
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

// export function makeMotionAnimations<V extends AnimatableValue>(
//   from: V,
//   to: V | GenericKeyframes<V>,
//   options: MergedAnimationOptions<V>
// ): MotionAnimation[] {
//   if (!isArray(to)) return [motionAnimation(from, to, options)]

//   if (to.length === 0) return []

//   const keyframes = to.map((item, i) => {
//     if (i === 0 && isNull(item)) return from
//     return item as unknown as V
//   })

//   if (keyframes.length === 1) keyframes.unshift(from)

//   const duration = options.duration / (keyframes.length - 1)

//   return keyframes.reduce<MotionAnimation[]>((animations, item, i) => {
//     if (i === 0) return animations

//     const lastAnimation = animations[animations.length - 1]

//     const nextFrom = lastAnimation ? lastAnimation.original[1] : keyframes[i - 1]

//     const animation = motionAnimation(nextFrom, item, options)

//     animation.duration = duration

//     if (i > 1) animation.start = lastAnimation.end

//     return pushItem(animations, animation)
//   }, [])
// }

export function typedTween<T>(type: T) {
  return <V extends AnimatableValue>(from: V, to: V, options: MergedAnimationOptions) => {
    const { easing: $easing } = options

    let $duration = options.duration
    let $start = 0

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
      get type() {
        return type
      },

      get unit() {
        return unit
      },

      get original() {
        return [from, to] as const
      },

      get delay() {
        return options.delay
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
}

export const makeValueTween = typedTween('value') as <V>() => MotionValueTween<V>
export const makeElementTween = typedTween('element') as <V>() => MotionElementTween<V>
