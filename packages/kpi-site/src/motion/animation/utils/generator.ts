import interpolator from '../../utils/interpolator'
import decompose from '../../parse/utils/decompose'

import type { EasingFunction } from '../../easing/interface'
import type { AnimatableValue } from '../interface'

export default function createTweenGenerator<V extends AnimatableValue>(
  target: V[],
  times: number[],
  easing: EasingFunction
) {
  const Target = target.map(decompose)

  return (elapsed: number) => {
    const active = times.findIndex((time) => elapsed < time)

    if (active === -1) return target[target.length - 1]

    const From = Target[active - 1]

    const To = Target[active]

    const mapping = interpolator.bind(null, elapsed, [times[active - 1], times[active]])

    const numbers = To.numbers.map((num, i) => {
      const [percent, transform] = mapping([From.numbers[i], num])

      return transform(easing(percent))
    })

    if (To.numeric) return numbers[0] as V

    return To.strings.reduce((res, str, i) => `${res}${str}${numbers[i] ?? ''}`, '') as V
  }
}
