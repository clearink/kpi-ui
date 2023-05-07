import { isArray } from '@kpi/shared'

import type { MotionValue } from '../../motion'
import type { ElementOrSelector } from '../../utils/resolve_element'
import type { AnimationSequence } from '../interface'
import type { PlaybackControl } from '../playback_control'

export default function animateSequence(sequence: AnimationSequence): PlaybackControl {
  return {} as PlaybackControl
}
export function isSequenceAnimation<V>(
  animateInput: V | MotionValue<V> | ElementOrSelector | AnimationSequence
): animateInput is AnimationSequence {
  return isArray(animateInput) && isArray(animateInput[0])
}
