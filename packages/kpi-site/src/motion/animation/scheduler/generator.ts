import { logger, toArray } from '@kpi/shared'
import interpolator from '../../utils/interpolator'
import sanitize from '../../utils/sanitize'
import { normalizeEasings, normalizeTimes } from '../utils/normalize'

import type { TweenOptions } from '../interface'
import type TweenAnimation from './animation'

export default function updateGenerator(animations: TweenAnimation[], options: TweenOptions) {
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

    const range: [number, number] = [times[active - 1], times[active]]

    const animation = animations[backward ? steps - active : active - 1]

    if (!animation.initialized) animation.init()

    if (adjusted === 0 || (backward && adjusted === 1)) return animation.from!

    if (adjusted === 1 || (backward && adjusted === 0)) return animation.to!

    return animation.render((output) => {
      if (backward) output.reverse()

      const [percent, transform] = interpolator(adjusted, range, output)

      return sanitize(transform(easing(percent)))
    })
  }
}
