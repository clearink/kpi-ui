import { isObjectLike } from '@kpi/shared'
import { isMotionValue, motionValue } from '../../../motion'
import { setControllerTransition } from '../../utils/transition'
import { PlaybackControl } from '../tween'
import Options from '../../../config/options'
import valueTween from './tween'

import type { MotionValue } from '../../../motion'
import type { AnimatableValue, AnimateValueOptions, GenericKeyframes } from '../../interface'
import type { ElementOrSelector } from '../../utils/selector'

// string | number 动画效果
export default function animateValue<V extends AnimatableValue>(
  from: V | MotionValue<V>,
  to: V | GenericKeyframes<V>,
  options: AnimateValueOptions<V>
): PlaybackControl {
  const motion = motionValue(from)

  // TODO: drop previous motion.$promise

  const tween = valueTween(motion, to, options)

  setControllerTransition([tween], options)

  const emitter = createControllerEmitter()

  const control = new PlaybackControl([tween], emitter)

  return control
}

export function isValueAnimation<V extends AnimatableValue>(
  animateInput: V | MotionValue<V> | ElementOrSelector
): animateInput is V | MotionValue<V> {
  return !isObjectLike(animateInput) || isMotionValue(animateInput as any)
}
