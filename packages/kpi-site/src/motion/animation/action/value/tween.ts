import { toArray } from '@kpi/shared'
import Tween from '../tween'
import createTweenGenerator from './utils/generator'
import { normalizeEasings, normalizeTargets, normalizeTimes } from './utils/normalize'
import resolveTarget from './utils/resolve'

import type { MotionValue } from '../../../motion'
import type { AnimatableValue, AnimateValueOptions, GenericKeyframes } from '../../interface'

export default function valueTween<V extends AnimatableValue>(
  motion: MotionValue<V>,
  to: V | GenericKeyframes<V>,
  options: Required<AnimateValueOptions<V>>
) {
  const { times: $times, easing: $easing } = options

  // TODO: drop previous motion.$promise

  const from = motion.get()

  // 只解析 color, angle 形式的字符串
  const targets = resolveTarget(normalizeTargets(from, to))

  const times = normalizeTimes(targets, $times)

  const easings = normalizeEasings(times.length, toArray($easing))

  const generator = createTweenGenerator(targets, times, easings)

  const tween = new Tween(generator)

  tween.start = 0
  tween.delay = options.delay
  tween.duration = options.duration

  return tween
}
