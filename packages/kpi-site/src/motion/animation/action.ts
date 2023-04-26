import { pick, shallowMerge } from '@kpi/shared'
import { motionValue } from '../motion'
import { playbackControl } from './playback_control'
import { makeMotionAnimations } from './motion_animation'
import { defaultAnimationOptions } from './constant'

import type { PlaybackControl } from './playback_control'
import type { MotionValue } from '../motion'
import type { ElementOrSelector } from '../utils/resolve_element'
import type {
  AnimatableValue,
  AnimationOptions,
  AnimationScope,
  DOMKeyframesDefinition,
  GenericKeyframes,
} from './interface'
import resolveElements from '../utils/resolve_element'

// animate value or motionValue
const callbackNames = [
  'onCancel',
  'onChange',
  'onComplete',
  'onPause',
  'onRepeat',
  'onStart',
  'onStop',
] as const
export function animateValue<V extends AnimatableValue>(
  from: V | MotionValue<V>,
  to: V | GenericKeyframes<V>,
  options: AnimationOptions = {}
): PlaybackControl {
  // TODO: 需要清除之前的 animate 吗?
  const value = motionValue(from)

  const mergedOptions = shallowMerge(options, defaultAnimationOptions)

  // TODO: cleanup 清除之前的操作行为

  // TODO value.get(), to 进行转换 '#ff0' => rgba(255, 255, 0, 1)

  const animations = makeMotionAnimations(value.get(), to, mergedOptions)

  // 获取回调函数调度时触发
  const callbacks = pick(options, callbackNames)
  const control = playbackControl(value, callbacks, animations)

  console.log(animations)

  if (mergedOptions.autoplay) control.play()

  return control
}

// animate dom
export function animateElement<V extends AnimatableValue>(
  maybeElement: ElementOrSelector,
  keyframes: DOMKeyframesDefinition<V>,
  options?: AnimationOptions,
  scope?: AnimationScope
): PlaybackControl {
  const elements = resolveElements(maybeElement)

  // 根据 elements 与 keyframes 计算出最终的 animations
  const animations = []
  return {} as PlaybackControl
  // const value = motionValue(from)

  // console.log(value)

  // const animations = motionAnimation(value, to)

  // const control = playbackControl(value, animations, options)

  // if (options?.autoplay) control.play()

  // return control
}
