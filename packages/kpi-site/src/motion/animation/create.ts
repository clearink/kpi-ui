import { logger } from '@kpi/shared'
import resolveElements from '../utils/resolve_element'
import { motionValue as createMotionValue } from '../motion'
import GroupPlaybackControls from './group_control'
import animateMotionValue from './animate_motion_value'

import type { MotionValue } from '../motion'
import type {
  AnimateOptions,
  AnimationPlaybackControls,
  AnimationScope,
  DOMKeyframesDefinition,
} from './animate'
import type { ElementOrSelector } from '../utils/resolve_element'

export function animateElements(
  elementOrSelector: ElementOrSelector,
  keyframes: DOMKeyframesDefinition,
  options: AnimateOptions,
  scope?: AnimationScope
) {
  const elements = resolveElements(elementOrSelector)

  const animations: AnimationPlaybackControls[] = []

  logger(!elements.length, 'No valid element provided.')

  return new GroupPlaybackControls(animations)
}

export function animateValue<V>(
  value: MotionValue<V> | V,
  keyframes: V,
  options: AnimateOptions<V>
): AnimationPlaybackControls {
  const motionValue = createMotionValue(value)

  // motionValue.start(animateMotionValue('', motionValue, keyframes, options))

  return {} as any
}
