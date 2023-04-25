import { animateElement, animateValue } from './action'

import type { PlaybackControl } from './playback_control'
import type { ElementOrSelector } from '../utils/resolve_element'
import type { MotionValue } from '../motion'
import type {
  AnimatableValue,
  AnimationOptions,
  AnimationScope,
  DOMKeyframesDefinition,
  GenericKeyframes,
} from './interface'
import isElementAnimation from './utils/is_element_animation'

export function createAnimateWithScope(scope?: AnimationScope) {
  // animate string | number
  function scopedAnimate<V extends AnimatableValue>(
    from: V,
    to: V | GenericKeyframes<V>,
    options?: AnimationOptions<V>
  ): PlaybackControl

  // animate motion value
  function scopedAnimate<V extends AnimatableValue>(
    value: MotionValue<V>,
    keyframes: V | GenericKeyframes<V>,
    options?: AnimationOptions<V>
  ): PlaybackControl

  // animate dom
  function scopedAnimate(
    maybeElement: ElementOrSelector,
    keyframes: DOMKeyframesDefinition<AnimatableValue>,
    options?: AnimationOptions
  ): PlaybackControl

  function scopedAnimate<V extends AnimatableValue>(
    animateInput: V | MotionValue<V> | ElementOrSelector,
    keyframes: V | GenericKeyframes<V> | DOMKeyframesDefinition<V>,
    options?: AnimationOptions<V>
  ): PlaybackControl {
    let animation: PlaybackControl

    if (isElementAnimation(animateInput, keyframes)) {
      animation = animateElement(animateInput as any, keyframes as any, options, scope)
    } else {
      animation = animateValue(animateInput as any, keyframes as any, options)
    }

    if (scope) scope.animations.push(animation)

    return animation
  }

  return scopedAnimate
}

export const animate = createAnimateWithScope()
