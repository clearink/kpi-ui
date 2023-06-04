import clamp from '../../../../utils/clamp'
import interpolator from '../../../../utils/interpolator'
import decompose from '../../../../utils/decompose'

import type { EasingFunction } from '../../../../easing/interface'
import type { AnimatableValue } from '../../../interface'

export default function createTweenGenerator<V extends AnimatableValue>(
  targets: V[],
  times: number[],
  easings: EasingFunction[]
) {
  const decomposed = targets.map(decompose)

  return (progress: number): NonNullable<V> => {
    let active = times.findIndex((time) => progress < time)

    if (active === -1) active = targets.length - 1

    active = clamp(active, 0, targets.length - 1)

    const easing = easings[active - 1]

    const from = decomposed[active - 1]

    const to = decomposed[active]

    const mapping = interpolator.bind(null, progress, [times[active - 1], times[active]])

    const numbers = to.numbers.map((num, i) => {
      const [percent, transform] = mapping([from.numbers[i], num])

      return transform(easing(percent))
    })

    if (to.numeric) return numbers[0] as V

    return to.strings.reduce((res, str, i) => `${res}${str}${numbers[i] ?? ''}`, '') as V
  }
}
