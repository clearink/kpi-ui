import { shallowMerge } from '@kpi/shared'
import animateElement, { isElementAnimation } from './action/element/animate'
import animateSequence, { isSequenceAnimation } from './action/sequence/animate'
import animateValue, { isValueAnimation } from './action/value/animate'
import { Options } from '../config/options'

import type { ElementOrSelector } from './utils/selector'
import type { MotionValue } from '../motion'
import type { PlaybackControl } from './action/controller'
import type {
  AnimatableValue,
  AnimateValueOptions,
  AnimateElementOptions,
  AnimateSequenceOptions,
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
    options?: AnimateValueOptions<number>
  ): PlaybackControl

  // animate motion number
  function scopedAnimate(
    from: MotionValue<number>,
    to: number | GenericKeyframes<number>,
    options?: AnimateValueOptions<number>
  ): PlaybackControl

  // animate string
  function scopedAnimate(
    from: string,
    to: string | GenericKeyframes<string>,
    options?: AnimateValueOptions<string>
  ): PlaybackControl

  // animate motion string
  function scopedAnimate(
    from: MotionValue<string>,
    to: string | GenericKeyframes<string>,
    options?: AnimateValueOptions<string>
  ): PlaybackControl

  // animate dom
  function scopedAnimate(
    element: ElementOrSelector,
    keyframes: ElementKeyframes,
    options?: AnimateElementOptions
  ): PlaybackControl

  // animate sequence
  function scopedAnimate(
    sequence: AnimationSequence,
    options?: AnimateSequenceOptions
  ): PlaybackControl

  function scopedAnimate<V extends AnimatableValue>(
    animateInput: V | MotionValue<V> | ElementOrSelector | AnimationSequence,
    keyframes: V | GenericKeyframes<V> | ElementKeyframes,
    options?: AnimateValueOptions<V> | AnimateElementOptions
  ): PlaybackControl {
    let animation: PlaybackControl

    if (isSequenceAnimation(animateInput)) {
      animation = animateSequence(animateInput)
    } else if (isElementAnimation(keyframes)) {
      const mergedOptions = shallowMerge(options, Options) as AnimateElementOptions
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
