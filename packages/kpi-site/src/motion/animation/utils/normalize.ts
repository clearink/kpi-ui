import { isString, pushItem } from '@kpi/shared'
import Options from '../config/options'

import type {
  AnimateElementOptions,
  AnimateSequenceOptions,
  AnimateValueOptions,
  AnimationSequence,
  TweenOptions,
} from '../interface'

export const getElementOptions = (
  property: string,
  options: AnimateElementOptions,
  root?: AnimateSequenceOptions
) => {
  const defaultOptions = { ...Options, ...root?.default }
  return { ...defaultOptions, ...options[property] } as AnimateValueOptions
}

export const getCommonOptions = (
  options: AnimateElementOptions | AnimateValueOptions,
  root?: AnimateSequenceOptions
) => ({ ...Options, ...options, ...root?.default } as Required<AnimateValueOptions>)

export function normalizeTimelineOptions(
  sequence: AnimationSequence,
  options?: AnimateSequenceOptions
) {
  const init = [{ start: 0, ...Options }] as TweenOptions[]
  const timeline = sequence.reduce((res, item, i) => {
    // TODO: 添加标签
    if (isString(item)) return res

    const valueOptions = getCommonOptions(item[2] ?? {}, options)
    const { delay, duration, repeatDelay, repeat } = valueOptions

    const prevStart = res[i - 1]?.start || 0

    const current = prevStart + delay + duration + (repeatDelay + duration) * repeat

    return pushItem(res, { ...valueOptions, start: current })
  }, init)

  return timeline
}

export function normalizeControllerOptions(
  timelineOptions: (AnimateValueOptions & { start: number })[],
  options?: AnimateSequenceOptions
): AnimateValueOptions & { start: number } {
  return {} as any
}
