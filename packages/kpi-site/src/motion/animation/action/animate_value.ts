import { isObjectLike, shallowMerge } from '@kpi/shared'
import { isMotionValue, motionValue } from '../../motion'
import { Options } from '../config/default'
import { makeMotionAnimations } from '../motion_animation'
import { playbackControl } from '../playback_control'

import type { MotionValue } from '../../motion'
import type { AnimatableValue, AnimationOptions, GenericKeyframes } from '../interface'
import type { PlaybackControl } from '../playback_control'
import type { ElementOrSelector } from '../../utils/resolve_element'

export default function animateValue<V extends AnimatableValue>(
  from: V | MotionValue<V>,
  to: V | GenericKeyframes<V>,
  options: AnimationOptions = {}
): PlaybackControl {
  // TODO: 需要清除之前的 animate 吗?
  const value = motionValue(from)

  const mergedOptions = shallowMerge(options, Options)

  // TODO: cleanup 清除之前的操作行为

  // TODO value.get(), to 进行转换 '#ff0' => rgba(255, 255, 0, 1)

  const animations = makeMotionAnimations(value.get(), to, mergedOptions)

  const control = playbackControl(value, animations, mergedOptions)

  console.log(animations)

  if (mergedOptions.autoplay) control.play()

  return control
}

export function isValueAnimation<V extends AnimatableValue>(
  animateInput: V | MotionValue<V> | ElementOrSelector
): animateInput is V | MotionValue<V> {
  return !isObjectLike(animateInput) || isMotionValue(animateInput as any)
}
