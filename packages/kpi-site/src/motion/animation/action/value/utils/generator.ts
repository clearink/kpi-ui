import decompose from '../../../../utils/decompose'
import interpolator from '../../../../utils/interpolator'

import type { EasingFunction } from '../../../../easing/interface'
import type { AnimatableValue, TweenOptions } from '../../../interface'

export default function createTweenGenerator<V extends AnimatableValue>(
  targets: V[],
  times: number[],
  easings: EasingFunction[],
  repeatType: TweenOptions['repeatType']
) {
  const decomposed = targets.map(decompose)

  const steps = targets.length

  return (ratio: number, iterations: number) => {
    const odd = iterations % 2 === 1

    const backward = repeatType === 'mirror' && odd

    const progress = repeatType === 'reverse' && odd ? 1 - ratio : ratio

    // 要么选最后一个, 要么选符合要求的
    const active = times.findIndex((time, i) => i === steps - 1 || progress < time)

    const easing = easings[active - 1]

    const from = decomposed[backward ? steps - active : active - 1]

    const to = decomposed[backward ? steps - 1 - active : active]

    const mapping = interpolator.bind(null, progress, [times[active - 1], times[active]])

    const numbers = to.numbers.map((num, i) => {
      const [percent, transform] = mapping([from.numbers[i], num])

      return transform(easing(percent))
    })

    if (to.numeric) return numbers[0] as V

    return to.strings.reduce((res, str, i) => `${res}${str}${numbers[i] ?? ''}`, '') as V
  }
}
