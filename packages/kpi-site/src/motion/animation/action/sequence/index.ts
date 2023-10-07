import { isArray } from '@kpi/shared'

import type {
  AnimatableValue,
  AnimateSequenceOptions,
  AnimationScope,
  AnimationSequence,
} from '../../interface'
import type { ElementOrSelector } from '../../utils/selector'
import type { TweenController } from '../../scheduler'

export default function animateSequence(
  sequence: AnimationSequence,
  options?: AnimateSequenceOptions,
  scope?: AnimationScope
) {
  return {} as TweenController
}
export function isSequenceAnimation<V extends AnimatableValue>(
  animateInput: V | ElementOrSelector | AnimationSequence
): animateInput is AnimationSequence {
  return isArray(animateInput) && isArray(animateInput[0])
}
