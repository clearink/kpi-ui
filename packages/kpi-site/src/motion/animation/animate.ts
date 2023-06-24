import animateElement, { isElementAnimation } from './action/element'
import animateSequence, { isSequenceAnimation } from './action/sequence'
import animateValue, { isValueAnimation } from './action/value'

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
import type { TweenController } from './scheduler'
import type { ElementOrSelector } from './utils/selector'

export function createAnimateWithScope(scope?: AnimationScope) {
  // animate number
  function scopedAnimate(
    from: number,
    to: number | GenericKeyframes<number>,
    options?: AnimateValueOptions<number>
  ): TweenController

  // animate motion number
  function scopedAnimate(
    from: MotionValue<number>,
    to: number | GenericKeyframes<number>,
    options?: AnimateValueOptions<number>
  ): TweenController

  // animate string
  function scopedAnimate(
    from: string,
    to: string | GenericKeyframes<string>,
    options?: AnimateValueOptions<string>
  ): TweenController

  // animate motion string
  function scopedAnimate(
    from: MotionValue<string>,
    to: string | GenericKeyframes<string>,
    options?: AnimateValueOptions<string>
  ): TweenController

  // animate dom
  function scopedAnimate(
    element: ElementOrSelector,
    keyframes: ElementKeyframes,
    options?: AnimateElementOptions
  ): TweenController

  // animate sequence
  function scopedAnimate(
    sequence: AnimationSequence,
    options?: AnimateSequenceOptions
  ): TweenController

  function scopedAnimate<V extends AnimatableValue>(
    animateInput: V | MotionValue<V> | ElementOrSelector | AnimationSequence,
    keyframes: V | GenericKeyframes<V> | ElementKeyframes | AnimateSequenceOptions,
    options?: AnimateValueOptions<V> | AnimateElementOptions | AnimateSequenceOptions
  ): TweenController {
    let animation: TweenController

    if (isSequenceAnimation(animateInput)) {
      animation = animateSequence(animateInput, options as any, scope)
    } else if (isElementAnimation(keyframes)) {
      animation = animateElement(animateInput as any, keyframes, options as any, scope)
    } else if (isValueAnimation(animateInput)) {
      animation = animateValue(animateInput, keyframes as any, options as any)
    } else throw Error('invalid animate targets')

    if (scope) scope.animations.push(animation)

    return animation
  }

  return scopedAnimate
}

export const animate = createAnimateWithScope()
