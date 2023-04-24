import { motionValue } from '../motion'
import { playbackControl } from './playback_control'

import type { PlaybackControl } from './playback_control'
import type { MotionValue } from '../motion'
import type { ElementOrSelector } from '../utils/resolve_element'
import type {
  AnimatableValue,
  AnimationOptions,
  AnimationScope,
  DOMKeyframesDefinition,
} from './interface'
import { motionAnimation } from './motion_animation'

// animate value or motionValue
export function animateValue<V extends AnimatableValue>(
  from: V | MotionValue<V>,
  to: V,
  options?: AnimationOptions
): PlaybackControl {
  const value = motionValue(from)

  const animation = motionAnimation(value.get(), to, options)

  const control = playbackControl(value, [animation])

  if (options?.autoplay) control.play()

  console.log(control)

  return control
}

// animate dom
export function animateElement<V>(
  maybeElement: ElementOrSelector,
  keyframes: DOMKeyframesDefinition,
  options?: AnimationOptions,
  scope?: AnimationScope
): PlaybackControl {
  return {} as PlaybackControl
  // const value = motionValue(from)

  // console.log(value)

  // const animations = motionAnimation(value, to)

  // const control = playbackControl(value, animations, options)

  // if (options?.autoplay) control.play()

  // return control
}
