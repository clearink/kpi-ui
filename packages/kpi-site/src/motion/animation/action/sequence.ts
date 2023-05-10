import { isArray } from '@kpi/shared'

import type { MotionValue } from '../../motion'
import type { ElementOrSelector } from '../../utils/resolve_element'
import type {
  AnimatableValue,
  AnimationOptions,
  AnimationScope,
  AnimationSequence,
} from '../interface'
import type { PlaybackControl } from '../controller'

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
