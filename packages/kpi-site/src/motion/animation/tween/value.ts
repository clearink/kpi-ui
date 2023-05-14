import { isArray, isNull } from '@kpi/shared'
import decompose from '../../parse/utils/decompose'
import { getUnit } from '../../parse/utils/getters'
import { pushItem } from '../../utils/array'
import interpolator from '../../utils/interpolator'
import { normalizeEasing } from '../utils/normalize'

import type { AnimatableValue, GenericKeyframes, AnimationOptions } from '../interface'
import type { ValueTween } from './interface'
import type { MotionValue } from '../../motion'

export function valueTween<V extends AnimatableValue = AnimatableValue>(
  from: V,
  to: V,
  options: Required<AnimationOptions<V>>
): ValueTween<V> {
  const $unit = getUnit(to)
  const $original = Object.freeze([from, to] as const)

  // TODO: 处理 options.times 与 keyframes

  const easing = normalizeEasing(options.easing)

  const From = decompose(from)
  const To = decompose(to)

  let $start = 0
  let $duration = 0

  return {
    get type() {
      return 'value' as const
    },
    get unit() {
      return $unit
    },
    get original() {
      return $original
    },
    get delay() {
      return options.delay
    },
    get end() {
      return this.delay + this.start + this.duration
    },

    get start() {
      return $start
    },
    set start(start: number) {
      $start = start
    },

    get duration() {
      return $duration
    },
    set duration(duration: number) {
      $duration = duration
    },

    transform: <T extends V>(elapsed: number): T => {
      const mapping = interpolator.bind(null, easing(elapsed / $duration), [0, 1])

      const numbers = To.numbers.map((num, i) => mapping([From.numbers[i], num]))

      if (To.numeric) return numbers[0] as T

      return To.strings.reduce((result, str, index) => {
        return `${result}${str}${numbers[index] ?? ''}`
      }, '') as T
    },
  }
}

export function valueTweens<V extends AnimatableValue>(
  value: MotionValue<V>,
  to: V | GenericKeyframes<V>,
  options: Required<AnimationOptions<V>>
): ValueTween<V>[] {
  // TODO: 此处应该只生成一个 valueTween 对象
  // 解析 times 与 keyframes 数据
  const from = value.get()

  if (!isArray(to)) return [valueTween(from, to, options)]

  if (to.length === 0) return []

  const keyframes = to.map((item, i) => {
    if (i === 0 && isNull(item)) return from
    return item as unknown as V
  })

  const duration = options.duration / (keyframes.length - 1)

  return keyframes.reduce<ValueTween<V>[]>((animations, item, i) => {
    if (i === 0) return animations

    const lastAnimation = animations[animations.length - 1]

    const nextFrom = lastAnimation ? lastAnimation.original[1] : keyframes[i - 1]

    const tween = valueTween(nextFrom, item, options)

    tween.duration = duration

    if (i > 1) tween.start = lastAnimation.end

    return pushItem(animations, tween)
  }, [])
}
