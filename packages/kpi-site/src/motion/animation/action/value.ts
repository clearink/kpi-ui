import { isObjectLike } from '@kpi/shared'
import { isMotionValue, motionValue } from '../../motion'
import { playbackControl } from '../controller'
import valueTween from '../tween/value'

import type { MotionValue } from '../../motion'
import type { PlaybackControl } from '../controller'
import type {
  AnimatableValue,
  AnimationOptions,
  ElementOrSelector,
  GenericKeyframes,
} from '../interface'

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

  const tween = valueTween(value, to, options)

  const control = playbackControl([tween])

  if (options.autoplay) control.play()

  return control
}

export function isValueAnimation<V extends AnimatableValue>(
  animateInput: V | MotionValue<V> | ElementOrSelector
): animateInput is V | MotionValue<V> {
  return !isObjectLike(animateInput) || isMotionValue(animateInput as any)
}
