import { motionAnimation } from './animation'
import playbackControl from './playback_control'
import { motionValue } from '../motion'

import type { AnimationOptions } from './animation'
import type { MotionValue } from '../motion'
import type { ElementOrSelector } from '../utils/resolve_element'

export function animate(
  elementOrSelector: ElementOrSelector,
  keyframes: any,
  options: AnimationOptions
) {}

// animate value or motionValue
export function animateValue<V>(from: V | MotionValue<V>, to: V, options?: AnimationOptions) {
  const value = motionValue(from)

  // create animation
  const animation = motionAnimation(value, to as any, options)

  // create playback control
  const control = playbackControl([animation])

  if (options?.autoplay) control.play()

  return control
}
