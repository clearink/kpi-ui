import { isArray } from '@kpi/shared'

import type { MotionValue } from '../../../motion'
import type { PlaybackControl } from '../controller'
import type { ElementOrSelector } from '../../utils/selector'
import type {
  AnimatableValue,
  AnimateSequenceOptions,
  AnimationScope,
  AnimationSequence,
} from '../../interface'

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
