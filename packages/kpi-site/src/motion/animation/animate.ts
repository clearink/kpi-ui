import animateValue, { isValueAnimation } from './action/animate_value'
import animateElement, { isElementAnimation } from './action/animate_element'
import animateSequence, { isSequenceAnimation } from './action/animate_sequence'

import type { PlaybackControl } from './playback_control'
import type { ElementOrSelector } from '../utils/resolve_element'
import type { MotionValue } from '../motion'
import type {
  AnimationOptions,
  AnimationScope,
  AnimationSequence,
  DOMKeyframes,
  GenericKeyframes,
} from './interface'

export function createAnimateWithScope(scope?: AnimationScope) {
  // animate value
  function scopedAnimate<V>(
    from: V | MotionValue<NonNullable<V>>,
    to: V | GenericKeyframes<V>,
    options?: AnimationOptions<NonNullable<V>>
  ): PlaybackControl
  // animate dom
  function scopedAnimate(
    element: ElementOrSelector,
    keyframes: DOMKeyframes,
    options?: AnimationOptions
  ): PlaybackControl
  // animate sequence
  function scopedAnimate(sequence: AnimationSequence, options?: AnimationOptions): PlaybackControl

  function scopedAnimate<V>(
    animateInput: V | MotionValue<V> | ElementOrSelector | AnimationSequence,
    keyframes: V | GenericKeyframes<V> | DOMKeyframes,
    options?: AnimationOptions<V>
  ): PlaybackControl {
    let animation: PlaybackControl

    if (isSequenceAnimation(animateInput)) {
      animation = animateSequence(animateInput)
    } else if (isElementAnimation(keyframes)) {
      animation = animateElement(animateInput as ElementOrSelector, keyframes, options, scope)
    } else if (isValueAnimation(animateInput)) {
      animation = animateValue(animateInput, keyframes, options)
    } else {
      throw Error('invalid animate targets')
    }

    if (scope) scope.animations.push(animation)

    return animation
  }

  return scopedAnimate
}

export const animate = createAnimateWithScope()
