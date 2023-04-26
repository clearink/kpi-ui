import { animateElement, animateValue } from './action'

import type { PlaybackControl } from './playback_control'
import type { ElementOrSelector } from '../utils/resolve_element'
import type { MotionValue } from '../motion'
import type {
  AnimationOptions,
  AnimationScope,
  DOMKeyframesDefinition,
  GenericKeyframes,
} from './interface'
import isElementAnimation from './utils/is_element_animation'

export function createAnimateWithScope(scope?: AnimationScope) {
  // animate value
  function scopedAnimate<V>(
    from: V | MotionValue<NonNullable<V>>,
    to: V | GenericKeyframes<V>,
    options?: AnimationOptions<NonNullable<V>>
  ): PlaybackControl
  // animate dom
  function scopedAnimate<V>(
    maybeElement: ElementOrSelector,
    keyframes: DOMKeyframesDefinition<V>,
    options?: AnimationOptions
  ): PlaybackControl

  function scopedAnimate<V>(
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
