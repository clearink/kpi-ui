import { isObjectLike, shallowMerge } from '@kpi/shared'
import { isMotionValue, motionValue } from '../../../motion'
import Options from '../../config/options'
import { TweenController } from '../../scheduler'
import createTweenRenderer from './renderer'
// import { createControllerGenerator } from './utils/generator'
// import defineHidden from '../../../utils/define_hidden'
// import { $promise } from '../../../utils/symbol'

import type { MotionValue } from '../../../motion'
import type { AnimatableValue, AnimateValueOptions, GenericKeyframes } from '../../interface'
import type { ElementOrSelector } from '../../utils/selector'

export default function animateValue<V extends AnimatableValue>(
  from: V | MotionValue<V>,
  to: V | GenericKeyframes<V>,
  options: AnimateValueOptions<V>
) {
  const mergedOptions = shallowMerge(options, Options)

  const motion = motionValue(from)

  const renderer = createTweenRenderer(motion, to, { start: 0, ...mergedOptions })

  // const generator = createControllerGenerator()
  const controller = new TweenController([renderer])

  if (mergedOptions.autoplay) controller.play()

  // TODO: controller 挂到 motion 上，下次 play 时可以取消掉

  // defineHidden(motion, $promise, controller)

  return controller
}

export function isValueAnimation<V extends AnimatableValue>(
  animateInput: V | MotionValue<V> | ElementOrSelector
): animateInput is V | MotionValue<V> {
  return !isObjectLike(animateInput) || isMotionValue(animateInput as any)
}
