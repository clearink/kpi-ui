/* eslint-disable no-param-reassign */
import Options from '../../config/options'

import type { Renderer } from '../engine'
import type {
  AnimationSequence,
  AnimateSequenceOptions,
  AnimatableValue,
  AnimateElementOptions,
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
  renderers: Renderer[],
  options: AnimateValueOptions<V> = {}
) {}

export function getTimelineTransition(
  sequence: AnimationSequence,
  options: AnimateSequenceOptions
) {}
