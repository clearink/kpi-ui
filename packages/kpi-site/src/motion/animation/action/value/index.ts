import { isObjectLike, shallowMerge } from '@kpi/shared'
import { isMotionValue, motionValue } from '../../../motion'
import { defineHidden } from '../../../utils/define'
import { $controller } from '../../../utils/symbol'
import Options from '../../config/options'
import { TweenController } from '../../scheduler'
import createTweenRenderer from './renderer'

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

  // 取消上次的动画, 一个 motionValue 同时只能进行一个 animate
  motion[$controller] && motion[$controller].cancel()

  const renderer = createTweenRenderer(motion, to, mergedOptions)

  const controller = new TweenController([renderer])

  defineHidden(motion, $controller, controller)

  if (mergedOptions.autoplay) controller.play()

  return controller
}

export function isValueAnimation<V extends AnimatableValue>(
  animateInput: V | MotionValue<V> | ElementOrSelector
): animateInput is V | MotionValue<V> {
  return !isObjectLike(animateInput) || isMotionValue(animateInput as any)
}
