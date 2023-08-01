import decompose from '../../utils/decompose'
import interpolator from '../../utils/interpolator'
import sanitize from '../../utils/sanitize'

import type { EasingFunction } from '../../easing/interface'
import type { AnimatableValue, TweenOptions } from '../interface'

export default function updateGenerator<V extends AnimatableValue>(
  items: { original: V; formatted: ReturnType<typeof decompose> }[],
  times: number[],
  easings: EasingFunction[],
  repeatType: TweenOptions['repeatType']
) {
  const steps = items.length

  return (progress: number, iterations: number) => {
    const odd = iterations % 2 === 1

    const backward = repeatType === 'mirror' && odd

    const adjusted = repeatType === 'reverse' && odd ? 1 - progress : progress

    // 要么选最后一个, 要么选符合要求的
    const active = times.findIndex((time, i) => i === steps - 1 || adjusted < time)

    const easing = easings[active - 1]

    const from = items[backward ? steps - active : active - 1]

    const to = items[backward ? steps - 1 - active : active]

    if (adjusted === 0) return from.original

    if (adjusted === 1) return to.original

    const range: [number, number] = [times[active - 1], times[active]]

    const numbers = to.formatted.numbers.map((num, i) => {
      const [percent, transform] = interpolator(adjusted, range, [from.formatted.numbers[i], num])

      return sanitize(transform(easing(percent)))
    })

    if (to.formatted.numeric) return numbers[0] as V

    return to.formatted.strings.reduce((r, s, i) => `${r + s}${numbers[i] ?? ''}`, '') as V
  }
}
