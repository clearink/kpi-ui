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
  const common = targets.map(decompose)
  const mirror = [...targets].reverse().map(decompose)

  const steps = targets.length

  return (progress: number, iterations: number): NonNullable<V> => {
    const change = repeatType === 'mirror' && iterations % 2

    const adjusted = repeatType === 'reverse' && iterations % 2 ? 1 - progress : progress

    let active = times.findIndex((time, i) => i < steps && adjusted < time)

    // 找不到就用最后一个
    if (active === -1) active = steps - 1

    const easing = easings[active - 1]

    const from = change ? mirror[active - 1] : common[active - 1]

    const to = change ? mirror[active] : common[active]

    const mapping = interpolator.bind(null, progress, [times[active - 1], times[active]])

    const numbers = to.numbers.map((num, i) => {
      const [percent, transform] = mapping([from.numbers[i], num])

      return transform(easing(percent))
    })

    if (to.numeric) return numbers[0] as V

    return to.strings.reduce((res, str, i) => `${res}${str}${numbers[i] ?? ''}`, '') as V
  }
}
