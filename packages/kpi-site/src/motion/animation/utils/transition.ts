/* eslint-disable no-param-reassign */
import Options from '../../config/options'

import type { Tween } from '../action/tween'
import type {
  AnimatableValue,
  AnimateElementOptions,
  AnimateSequenceOptions,
  AnimateValueOptions,
} from '../interface'

export function getTransition(
  transition: AnimateValueOptions | AnimateSequenceOptions | AnimateElementOptions,
  key?: string
) {
  return transition
  // return key ? transition[key] : { ...transition, ...transition.default }
}

// 暂时只考虑 value tween
export function setControllerTransition<V extends AnimatableValue>(
  tweens: Tween[],
  options: AnimateValueOptions<V> = {}
) {
  tweens.forEach((tween, index) => {
    const prev = tweens[index - 1]

    tween.start = prev ? prev.end : 0
    tween.duration = options.duration ?? Options.duration
    tween.delay = Math.max(options.delay ?? Options.delay, 0)
    tween.repeat = Math.max(options.repeat ?? Options.repeat, 0)
    tween.repeatType = options.repeatType ?? Options.repeatType
    tween.repeatDelay = options.repeatDelay ?? Options.repeatDelay
  })
}
