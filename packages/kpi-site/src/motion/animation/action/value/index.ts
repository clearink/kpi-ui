import { isObjectLike, noop, shallowMerge } from '@kpi/shared'
import { isMotionValue } from '../../../motion'
import Options from '../../config/options'
import { TweenController } from '../../scheduler'
import createTweenRenderer from './renderer'
// import { createControllerGenerator } from './utils/generator'

import type { MotionValue } from '../../../motion'
import type { AnimatableValue, AnimateValueOptions, GenericKeyframes } from '../../interface'
import type { ElementOrSelector } from '../../utils/selector'

export default function animateValue<V extends AnimatableValue>(
  from: V | MotionValue<V>,
  to: V | GenericKeyframes<V>,
  options: AnimateValueOptions<V>
) {
  const mergedOptions = shallowMerge(options, Options)

  const renderer = createTweenRenderer(from, to, { start: 0, ...mergedOptions })

  // const generator = createControllerGenerator()
  const controller = new TweenController([renderer], noop, { start: 0, duration: renderer.end })

  if (mergedOptions.autoplay) controller.play()

  return controller
}

export function isValueAnimation<V extends AnimatableValue>(
  animateInput: V | MotionValue<V> | ElementOrSelector
): animateInput is V | MotionValue<V> {
  return !isObjectLike(animateInput) || isMotionValue(animateInput as any)
}
