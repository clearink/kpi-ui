import { toArray } from '@kpi/shared'
import createTweenGenerator from '../utils/generator'
import { normalizeEasings, normalizeTweenTarget, normalizeTweenTimes } from '../utils/normalize'
import { resolveValueTweenTarget } from '../utils/resolve'
import createTweenEventTrigger from '../utils/trigger'
import tweenBase from './base'

import type { MotionValue } from '../../motion'
import type { AnimatableValue, AnimationOptions, GenericKeyframes } from '../interface'
import type { Tween, TweenTransition } from './interface'

export default function valueTween<V extends AnimatableValue>(
  motion: MotionValue<V>,
  to: V | GenericKeyframes<V>,
  options: Required<AnimationOptions<V>>
): Tween {
  const { times: $times, easing: $easing } = options

  // TODO: drop previous motion.$promise

  const from = motion.get()

  // 只解析 color, angle 形式的字符串
  const targets = resolveValueTweenTarget(normalizeTweenTarget(from, to))

  const times = normalizeTweenTimes(targets, $times)

  const easings = normalizeEasings(times.length, toArray($easing))

  const generator = createTweenGenerator(targets, times, easings)

  const trigger = createTweenEventTrigger()

  // TODO: add tween transition
  const transition: TweenTransition = {
    delay: options.delay,
    start: 0,
    duration: options.duration,
  }
  // normalizeTweenTransition()

  return tweenBase(generator, trigger, transition)
}

/**
 * 
  // return {
  //   get start() {
  //     return $start
  //   },
  //   set start(start: number) {
  //     $start = start
  //   },
  //   get delay() {
  //     return $delay
  //   },
  //   get end() {
  //     return this.delay + this.start + this.duration
  //   },
  //   get duration() {
  //     return $duration
  //   },
  //   tick: (time: number) => {
  //     const elapsed = clamp(time - $start - options.delay, 0, $duration)
  //     const current = generator(elapsed / $duration)

  //     // trigger

  //     motion.set(current)

  //     // change
  //     motion.notify('change', current)
  //     options.onChange(current)
  //     // options event
  //   },
  // }
 */
