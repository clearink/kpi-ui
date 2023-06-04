import { isObjectLike } from '@kpi/shared'
import { isMotionValue, motionValue } from '../../../motion'
import { playbackControl } from '../controller'
import valueTween from './tween'

import type { MotionValue } from '../../../motion'
import type { PlaybackControl } from '../controller'
import type { AnimatableValue, AnimateValueOptions, GenericKeyframes } from '../../interface'
import type { ElementOrSelector } from '../../utils/selector'

// string | number 动画效果
export default function animateValue<V extends AnimatableValue>(
  from: V | MotionValue<V>,
  to: V | GenericKeyframes<V>,
  options: Required<AnimateValueOptions<V>>
): PlaybackControl {
  const value = motionValue(from)

  const tween = valueTween(value, to, options)

  // 每个 tween 有一个自己的 trigger
  // 整个 control 也有一个自己的 trigger

  const control = playbackControl([tween])

  if (options.autoplay) control.play()

  return control
}

export function isValueAnimation<V extends AnimatableValue>(
  animateInput: V | MotionValue<V> | ElementOrSelector
): animateInput is V | MotionValue<V> {
  return !isObjectLike(animateInput) || isMotionValue(animateInput as any)
}
