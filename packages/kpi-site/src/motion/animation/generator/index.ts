import { logger, toArray } from '@kpi/shared'
import interpolator from '../../utils/interpolator'
import sanitize from '../../utils/sanitize'
import { normalizeEasings, normalizeTimes } from '../utils/normalize'

import type { AnimatableValue, TweenOptions } from '../interface'
import type { GeneratorItem } from './item'

export default function updateGenerator(targets: GeneratorItem[], options: TweenOptions) {
  const steps = targets.length

  const times = normalizeTimes(steps, options.times || [])

  logger(times[0] !== 0, 'Please ensure times[0] equal 0')

  const easings = normalizeEasings(steps, toArray(options.easing))

  return (progress: number, iterations: number): AnimatableValue => {
    const odd = iterations % 2 === 1

    // const backward = options.repeatType === 'mirror' && odd

    const adjusted = options.repeatType === 'reverse' && odd ? 1 - progress : progress

    // 要么选符合要求的, 要么选最后一个
    const active = times.findIndex((time, i) => adjusted < time || i === steps - 1)

    const easing = easings[active - 1]

    const from = targets[active - 1].decompose()

    const to = targets[active].decompose()

    // const from = targets[backward ? steps - active : active - 1].decompose()

    // const to = targets[backward ? steps - 1 - active : active].decompose()

    const range: [number, number] = [times[active - 1], times[active]]

    const numbers = to.numbers.map((num, i) => {
      const output: [number, number] = [from.numbers[i] || 0, num]

      const [percent, transform] = interpolator(adjusted, range, output)

      return sanitize(transform(easing(percent)))
    })

    if (to.numeric) return numbers[0]

    return to.strings.reduce((r, s, i) => `${r + s}${numbers[i] ?? ''}`, '')
  }
}
