import { logger, toArray } from '@kpi/shared'
import decompose from '../../utils/decompose'
import interpolator from '../../utils/interpolator'
import sanitize from '../../utils/sanitize'
import { normalizeEasings, normalizeTimes } from '../utils/normalize'

import type { AnimatableValue, TweenOptions } from '../interface'

export default function updateGenerator<V extends AnimatableValue>(
  targets: { original: V; formatted: ReturnType<typeof decompose> }[],
  options: TweenOptions
) {
  const steps = targets.length

  const times = normalizeTimes(steps, options.times || [])

  logger(times[0] !== 0, 'Please ensure times[0] equal 0')

  const easings = normalizeEasings(steps, toArray(options.easing))

  return (progress: number, iterations: number) => {
    const odd = iterations % 2 === 1

    const backward = options.repeatType === 'mirror' && odd

    const adjusted = options.repeatType === 'reverse' && odd ? 1 - progress : progress

    // 要么选最后一个, 要么选符合要求的
    const active = times.findIndex((time, i) => i === steps - 1 || adjusted < time)

    const easing = easings[active - 1]

    const from = targets[backward ? steps - active : active - 1]

    const to = targets[backward ? steps - 1 - active : active]

    if (adjusted === 0) return from.original

    if (adjusted === 1) return to.original

    const range: [number, number] = [times[active - 1], times[active]]

    const numbers = to.formatted.numbers.map((num, i) => {
      const output: [number, number] = [from.formatted.numbers[i] || 0, num]

      const [percent, transform] = interpolator(adjusted, range, output)

      return sanitize(transform(easing(percent)))
    })

    if (to.formatted.numeric) return numbers[0] as V

    return to.formatted.strings.reduce((r, s, i) => `${r + s}${numbers[i] ?? ''}`, '') as V
  }
}
