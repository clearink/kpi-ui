import { isObjectLike } from '@kpi/shared'
import { isMotionValue, motionValue } from '../../motion'
import { valueTweens } from '../tween/value'
import { playbackControl } from '../controller'

import type { MotionValue } from '../../motion'
import type { AnimatableValue, AnimationOptions, GenericKeyframes } from '../interface'
import type { PlaybackControl } from '../controller'
import type { ElementOrSelector } from '../../utils/resolve_element'

// string | number 动画效果
export default function animateValue<V extends AnimatableValue>(
  from: V | MotionValue<V>,
  to: V | GenericKeyframes<V>,
  options: Required<AnimationOptions<V>>
): PlaybackControl {
  // TODO: 需要清除之前的 animate 吗?
  const value = motionValue(from)

  // TODO: cleanup 清除之前的操作行为

  // TODO value.get(), to 进行转换 '#ff0' => rgba(255, 255, 0, 1)

  const tweens = valueTweens(value, to, options)

  const control = playbackControl(value, tweens, options)

  console.log('tweens', tweens)

  if (options.autoplay) control.play()

  return control
}

export function isValueAnimation<V extends AnimatableValue>(
  animateInput: V | MotionValue<V> | ElementOrSelector
): animateInput is V | MotionValue<V> {
  return !isObjectLike(animateInput) || isMotionValue(animateInput as any)
}
