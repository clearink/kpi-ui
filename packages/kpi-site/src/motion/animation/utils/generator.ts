import interpolator from '../../utils/interpolator'
import decompose from '../../parse/utils/decompose'

import type { EasingFunction } from '../../easing/interface'
import type { AnimatableValue } from '../interface'

export default function createTweenGenerator<V extends AnimatableValue>(
  targets: V[],
  times: number[],
  easings: EasingFunction[]
) {
  const decomposedTargets = targets.map(decompose)

  return (elapsed: number) => {
    const active = times.findIndex((time) => elapsed < time)

    if (active === -1) return targets[targets.length - 1]

    const easing = easings[active - 1]

    const from = decomposedTargets[active - 1]

    const to = decomposedTargets[active]

    const mapping = interpolator.bind(null, elapsed, [times[active - 1], times[active]])

    const numbers = to.numbers.map((num, i) => {
      const [percent, transform] = mapping([from.numbers[i], num])

      return transform(easing(percent))
    })

    if (to.numeric) return numbers[0] as V

    return to.strings.reduce((res, str, i) => `${res}${str}${numbers[i] ?? ''}`, '') as V
  }
}
