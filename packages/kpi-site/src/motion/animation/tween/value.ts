import { isArray, isNull } from '@kpi/shared'
import decompose from '../../parse/utils/decompose'
import { getUnit } from '../../parse/utils/getters'
import { pushItem } from '../../utils/array'
import interpolator from '../../utils/interpolator'
import { normalizeEasing } from '../utils/normalize'

import type { AnimatableValue, GenericKeyframes, AnimationOptions } from '../interface'

export class ValueTween<V extends AnimatableValue = AnimatableValue> {
  unit: string | null = null

  delay = 0

  original: readonly [V, V]

  start = 0

  duration = 0

  get end() {
    return this.start + this.delay + this.duration
  }

  transform: <T extends V>(elapsed: number) => T

  constructor(from: V, to: V, options: Required<AnimationOptions<V>>) {
    this.unit = getUnit(to)
    this.duration = options.duration
    this.delay = options.delay
    this.original = Object.freeze([from, to])

    const easing = normalizeEasing(options.easing)

    const From = decompose(from)
    const To = decompose(to)

    this.transform = <T extends V>(elapsed: number): T => {
      const mapping = interpolator.bind(null, easing(elapsed / this.duration), [0, 1])

      const numbers = To.numbers.map((num, i) => mapping([From.numbers[i], num]))

      if (To.numeric) return numbers[0] as T

      return To.strings.reduce((result, str, i) => {
        return `${result}${str}${numbers[i] ?? ''}`
      }, '') as T
    }
  }
}

export function makeValueTweens<V extends AnimatableValue>(
  from: V,
  to: V | GenericKeyframes<V>,
  options: Required<AnimationOptions<V>>
): ValueTween<V>[] {
  if (!isArray(to)) return [new ValueTween(from, to, options)]

  if (to.length === 0) return []

  const keyframes = to.map((item, i) => {
    if (i === 0 && isNull(item)) return from
    return item as unknown as V
  })

  if (keyframes.length === 1) keyframes.unshift(from)

  const duration = options.duration / (keyframes.length - 1)

  return keyframes.reduce<ValueTween<V>[]>((animations, item, i) => {
    if (i === 0) return animations

    const lastAnimation = animations[animations.length - 1]

    const nextFrom = lastAnimation ? lastAnimation.original[1] : keyframes[i - 1]

    const animation = new ValueTween(nextFrom, item, options)

    animation.duration = duration

    if (i > 1) animation.start = lastAnimation.end

    return pushItem(animations, animation)
  }, [])
}
