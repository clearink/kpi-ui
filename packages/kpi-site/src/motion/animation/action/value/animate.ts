import { isObjectLike } from '@kpi/shared'
import { isMotionValue, motionValue } from '../../../motion'
import { setTransition } from '../../utils/transition'
import Controller from '../controller'
import valueTween from './tween'

import type { MotionValue } from '../../../motion'
import type { AnimatableValue, AnimateValueOptions, GenericKeyframes } from '../../interface'
import type { ElementOrSelector } from '../../utils/selector'

// string | number 动画效果
export default function animateValue<V extends AnimatableValue>(
  from: V | MotionValue<V>,
  to: V | GenericKeyframes<V>,
  options: AnimateValueOptions<V>
): Controller {
  const value = motionValue(from)

  // TODO: drop previous motion.$promise

  const tween = valueTween(value, to, options)

  const tweens = setTransition([tween], options)

  const control = new Controller(tweens)

  if (options.autoplay) control.play()

  return control
}

export function isValueAnimation<V extends AnimatableValue>(
  animateInput: V | MotionValue<V> | ElementOrSelector
): animateInput is V | MotionValue<V> {
  return !isObjectLike(animateInput) || isMotionValue(animateInput as any)
}
