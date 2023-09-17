import { logger, toArray } from '@kpi/shared'
import interpolator from '../../utils/interpolator'
import sanitize from '../../utils/sanitize'
import { normalizeEasings, normalizeTimes } from '../utils/normalize'

import type { AnimatableValue, TweenOptions } from '../interface'
import type { TweenAnimation } from './animation'

export default function updateGenerator<V extends AnimatableValue = AnimatableValue>(
  animations: TweenAnimation[],
  options: TweenOptions
) {
  const { times: $times, easing: $easing, repeatType } = options

  const steps = animations.length

  const times = normalizeTimes(steps + 1, $times || [])

  logger(times[0] !== 0, 'Please ensure times[0] equal 0')

  const easings = normalizeEasings(times.length, toArray($easing))

  return (progress: number, iteration: number) => {
    const odd = iteration % 2 === 1

    const backward = repeatType === 'mirror' && odd

    const adjusted = repeatType === 'reverse' && odd ? 1 - progress : progress

    // 要么选符合要求的, 要么选最后一个
    const active = times.findIndex((time, i) => adjusted < time || i === steps)

    const easing = easings[active - 1]

    const animation = animations[backward ? steps - active : active - 1]

    animation.init()

    const range: [number, number] = [times[active - 1], times[active]]

    return animation.render(adjusted, (output) => {
      if (backward) output.reverse()
      const [percent, transform] = interpolator(adjusted, range, output)
      return sanitize(transform(easing(percent)))
    })
  }
}
