import { isArray } from '@kpi/shared'

import type { MotionValue } from '../../../motion'
import type {
  AnimatableValue,
  AnimateSequenceOptions,
  AnimationScope,
  AnimationSequence,
} from '../../interface'
import type { ElementOrSelector } from '../../utils/selector'
import type { Controller } from '../../engine'

export default function animateSequence(
  sequence: AnimationSequence,
  options?: AnimateSequenceOptions,
  scope?: AnimationScope
): Controller {
  return {} as Controller
}
export function isSequenceAnimation<V extends AnimatableValue>(
  animateInput: V | MotionValue<V> | ElementOrSelector | AnimationSequence
): animateInput is AnimationSequence {
  return isArray(animateInput) && isArray(animateInput[0])
}
