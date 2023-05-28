import { isArray } from '@kpi/shared'

import type { MotionValue } from '../../motion'
import type { PlaybackControl } from '../controller'
import type {
  AnimatableValue,
  AnimationOptions,
  AnimationScope,
  AnimationSequence,
  ElementOrSelector,
} from '../interface'

export default function animateSequence(
  sequence: AnimationSequence,
  options?: AnimationOptions,
  scope?: AnimationScope
): PlaybackControl {
  return {} as PlaybackControl
}
export function isSequenceAnimation<V extends AnimatableValue>(
  animateInput: V | MotionValue<V> | ElementOrSelector | AnimationSequence
): animateInput is AnimationSequence {
  return isArray(animateInput) && isArray(animateInput[0])
}
