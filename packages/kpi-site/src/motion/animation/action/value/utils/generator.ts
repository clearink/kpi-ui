import decompose from '../../../../utils/decompose'
import interpolator from '../../../../utils/interpolator'

import type { EasingFunction } from '../../../../easing/interface'
import type { AnimatableValue, TweenOptions } from '../../../interface'

export function createRendererGenerator<V extends AnimatableValue>(
  targets: { original: V; formatted: V }[],
  times: number[],
  easings: EasingFunction[],
  repeatType: TweenOptions['repeatType']
) {
  const decomposed = targets.map(({ original, formatted }) => {
    return { original, formatted: decompose(formatted) }
  })

  const steps = targets.length

  return (progress: number, iterations: number) => {
    const odd = iterations % 2 === 1

    const backward = repeatType === 'mirror' && odd

    const adjusted = repeatType === 'reverse' && odd ? 1 - progress : progress

    // 要么选最后一个, 要么选符合要求的
    const active = times.findIndex((time, i) => i === steps - 1 || adjusted < time)

    const easing = easings[active - 1]

    const from = decomposed[backward ? steps - active : active - 1]

    const to = decomposed[backward ? steps - 1 - active : active]

    if (adjusted === 0) return from.original

    if (adjusted === 1) return to.original

    const mapping = interpolator.bind(null, adjusted, [times[active - 1], times[active]])

    const numbers = to.formatted.numbers.map((num, i) => {
      const [percent, transform] = mapping([from.formatted.numbers[i], num])

      return transform(easing(percent))
    })

    if (to.formatted.numeric) return numbers[0] as V

    return to.formatted.strings.reduce((res, str, i) => `${res}${str}${numbers[i] ?? ''}`, '') as V
  }
}

export function createControllerGenerator() {}
