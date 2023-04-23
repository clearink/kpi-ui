import { isArray, isFunction, isString, shallowMerge } from '@kpi/shared'
import { AnimatableValue, AnimationOptions } from './interface'
import { cubicBezier, easings } from '../tween'
import getUnit from '../parse/utils/get_unit'
import { MotionAnimationType } from '../motion/interface'
import { Easing, EasingFunction } from '../tween/interface'

function getAnimateEasing(easing?: Easing) {
  if (isFunction(easing)) return easing

  if (isArray(easing) && easing.length === 4) return cubicBezier(...easing)

  if (isString(easing) && easings[easing]) return easings[easing]

  return easings.linear
}

const defaultAnimationOptions = {
  duration: 1000,
  easing: easings.linear,
  delay: 0,
}

export interface MotionAnimation {
  type?: MotionAnimationType
  property?: string
  unit: string | null
  value: readonly [AnimatableValue, AnimatableValue]
  duration: number
  easing: EasingFunction
  start: number
  end: number
  delay: number
  transform: () => void
}

export function motionAnimation<V extends AnimatableValue>(
  from: V,
  to: V,
  options: AnimationOptions = {}
): MotionAnimation {
  const merged = shallowMerge(options, defaultAnimationOptions)

  const numbers = []
  const strings = []

  return {
    unit: getUnit(to),
    easing: getAnimateEasing(merged.easing),
    value: Object.freeze([from, to]),
    duration: merged.duration,
    start: 0,
    delay: merged.delay,
    type: 'value',
    get end() {
      return this.start + this.delay + this.duration
    },
    transform: () => {},
  }
}
