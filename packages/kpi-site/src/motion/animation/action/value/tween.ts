import { omit, toArray } from '@kpi/shared'
import { Tween } from '../tween'
import { createTweenEmitter } from './utils/emitter'
import createTweenGenerator from './utils/generator'
import { normalizeEasings, normalizeTargets, normalizeTimes } from './utils/normalize'
import resolveTarget from './utils/resolve'

import type { MotionValue } from '../../../motion'
import type { AnimatableValue, AnimateValueOptions, GenericKeyframes } from '../../interface'

export default function valueTween<V extends AnimatableValue>(
  motion: MotionValue<V>,
  to: V | GenericKeyframes<V>,
  options: AnimateValueOptions<V>
): Tween {
  const { times: $times = [], easing: $easing } = options

  // 只解析 color, angle 形式的字符串
  const targets = resolveTarget(normalizeTargets(motion.get(), to))

  const times = normalizeTimes(targets, $times)

  const easings = normalizeEasings(times.length, toArray($easing))

  const generator = createTweenGenerator(targets, times, easings)

  // 设置最新值
  const emitter = createTweenEmitter(
    motion,
    // 在 valueTween 中 需要去除 options 中的事件监听
    // 这些事件监听是给 playbackControl 使用的
    omit(options, [
      'onUpdate',
      'onCancel',
      'onComplete',
      'onPause',
      'onRepeat',
      'onStart',
      'onStop',
    ])
  )

  return new Tween(emitter, (progress) => motion.set(generator(progress)))
}
