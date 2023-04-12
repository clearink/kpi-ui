import { animateElement, animateValue } from './action'

import type { PlaybackControl } from './playback_control'
import type { ElementOrSelector } from '../utils/resolve_element'
import type { MotionValue } from '../motion'
import type {
  AnimatableValue,
  AnimateOptions,
  AnimationScope,
  DOMKeyframesDefinition,
  GenericKeyframes,
} from './interface'

// TODO
const isDOMKeyframes = (val: any) => true

export function createAnimateWithScope(scope?: AnimationScope) {
  // animate string | number
  function scopedAnimate<V extends AnimatableValue>(
    from: V,
    to: V | GenericKeyframes<V>,
    options?: AnimateOptions<V>
  ): PlaybackControl

  // animate motion value
  function scopedAnimate<V extends AnimatableValue>(
    value: MotionValue<V>,
    keyframes: V | GenericKeyframes<V>,
    options?: AnimateOptions<V>
  ): PlaybackControl

  // animate dom
  function scopedAnimate<V>(
    maybeElement: ElementOrSelector,
    keyframes: DOMKeyframesDefinition,
    options?: AnimateOptions<V>
  ): PlaybackControl

  function scopedAnimate<V>(
    animateInput: V | MotionValue<V> | ElementOrSelector,
    keyframes: V | GenericKeyframes<V> | DOMKeyframesDefinition,
    options: AnimateOptions<V> = {}
  ): PlaybackControl {
    let animation: PlaybackControl

    if (isDOMKeyframes(keyframes)) {
      animation = animateElement(animateInput as ElementOrSelector, keyframes, options, scope)
    } else {
      animation = animateValue(animateInput, keyframes, options)
    }

    if (scope) scope.animations.push(animation)

    return animation
  }

  return scopedAnimate
}

export const animate = createAnimateWithScope()
