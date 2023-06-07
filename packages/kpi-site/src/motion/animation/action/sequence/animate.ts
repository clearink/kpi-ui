import { isArray } from '@kpi/shared'

import type { MotionValue } from '../../../motion'
import type {
  AnimatableValue,
  AnimateSequenceOptions,
  AnimationScope,
  AnimationSequence,
} from '../../interface'
import type { ElementOrSelector } from '../../utils/selector'
import type { PlaybackControl } from '../tween'

export default function animateSequence(
  sequence: AnimationSequence,
  options?: AnimateSequenceOptions,
  scope?: AnimationScope
): PlaybackControl {
  return {} as PlaybackControl
}
export function isSequenceAnimation<V extends AnimatableValue>(
  animateInput: V | MotionValue<V> | ElementOrSelector | AnimationSequence
): animateInput is AnimationSequence {
  return isArray(animateInput) && isArray(animateInput[0])
}
