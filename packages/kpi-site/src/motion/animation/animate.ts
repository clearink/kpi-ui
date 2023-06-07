import { shallowMerge } from '@kpi/shared'
import Options from '../config/options'
import animateElement, { isElementAnimation } from './action/element/animate'
import animateSequence, { isSequenceAnimation } from './action/sequence/animate'
import animateValue, { isValueAnimation } from './action/value/animate'

import type { MotionValue } from '../motion'
import type {
  AnimatableValue,
  AnimateElementOptions,
  AnimateSequenceOptions,
  AnimateValueOptions,
  AnimationScope,
  AnimationSequence,
  ElementKeyframes,
  GenericKeyframes,
} from './interface'
import type { ElementOrSelector } from './utils/selector'
import { PlaybackControl } from './action/tween'

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
    options?: AnimateValueOptions<V> | AnimateElementOptions | AnimateSequenceOptions
  ): PlaybackControl {
    let animation: PlaybackControl

    const mergedOptions = shallowMerge(options, Options)

    if (isSequenceAnimation(animateInput)) {
      animation = animateSequence(animateInput, options as AnimateSequenceOptions, scope)
    } else if (isElementAnimation(keyframes)) {
      animation = animateElement(
        animateInput as ElementOrSelector,
        keyframes,
        mergedOptions as AnimateElementOptions,
        scope
      )
    } else if (isValueAnimation(animateInput)) {
      animation = animateValue(animateInput, keyframes, mergedOptions)
    } else throw Error('invalid animate targets')

    if (mergedOptions?.autoplay) animation.play()

    if (scope) scope.animations.push(animation)

    return animation
  }

  return scopedAnimate
}

export const animate = createAnimateWithScope()
