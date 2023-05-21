import { shallowMerge } from '@kpi/shared'
import animateElement, { isElementAnimation } from './action/element'
import animateSequence, { isSequenceAnimation } from './action/sequence'
import animateValue, { isValueAnimation } from './action/value'
import { Options } from './config/default'

import type { MotionValue } from '../motion'
import type { ElementOrSelector } from '../utils/resolve_element'
import type { PlaybackControl } from './controller'
import type {
  AnimatableValue,
  AnimationOptions,
  AnimationScope,
  AnimationSequence,
  ElementKeyframes,
  GenericKeyframes,
} from './interface'

export function createAnimateWithScope(scope?: AnimationScope) {
  // animate number
  function scopedAnimate(
    from: number,
    to: number | GenericKeyframes<number>,
    options?: AnimationOptions<number>
  ): PlaybackControl
  // animate motion number
  function scopedAnimate(
    from: MotionValue<number>,
    to: number | GenericKeyframes<number>,
    options?: AnimationOptions<number>
  ): PlaybackControl
  // animate string
  function scopedAnimate(
    from: string,
    to: string | GenericKeyframes<string>,
    options?: AnimationOptions<string>
  ): PlaybackControl
  // animate motion string
  function scopedAnimate(
    from: MotionValue<string>,
    to: string | GenericKeyframes<string>,
    options?: AnimationOptions<string>
  ): PlaybackControl
  // animate dom
  function scopedAnimate<V>(
    element: ElementOrSelector,
    keyframes: ElementKeyframes,
    options?: AnimationOptions<V>
  ): PlaybackControl
  // animate sequence
  function scopedAnimate(sequence: AnimationSequence, options?: AnimationOptions): PlaybackControl

  function scopedAnimate<V extends AnimatableValue>(
    animateInput: V | MotionValue<V> | ElementOrSelector | AnimationSequence,
    keyframes: V | GenericKeyframes<V> | ElementKeyframes,
    options?: AnimationOptions<V>
  ): PlaybackControl {
    let animation: PlaybackControl

    if (isSequenceAnimation(animateInput)) {
      animation = animateSequence(animateInput)
    } else if (isElementAnimation(keyframes)) {
      const mergedOptions = shallowMerge(options, Options)
      animation = animateElement(animateInput as ElementOrSelector, keyframes, mergedOptions, scope)
    } else if (isValueAnimation(animateInput)) {
      const mergedOptions = shallowMerge(options, Options)
      animation = animateValue(animateInput, keyframes, mergedOptions)
    } else throw Error('invalid animate targets')

    if (scope) scope.animations.push(animation)

    return animation
  }

  return scopedAnimate
}

export const animate = createAnimateWithScope()
