import { AnimatableValue } from '../interface'

export type MotionTweenType = 'value' | 'element'
export type MotionTween<V> = MotionValueTween<V> | MotionElementTween<V>

export interface MotionValueTween<V> {
  readonly type: 'value'
  readonly unit: null | string
  readonly original: [V, V]
  readonly delay: number
  readonly end: number
  start: number
  duration: number
  transform: <T extends AnimatableValue>(elapsed: number) => T
}
export interface MotionElementTween<V> extends Omit<MotionValueTween<V>, 'type'> {
  readonly type: 'element'
  readonly targets: Element[]
}

/**
 * export function motionAnimation<V extends AnimatableValue>(
  from: V,
  to: V,
  options: Required<AnimationOptions<V>>
) {
  const { easing: $easing } = options

  let $duration = options.duration
  let $start = 0

  const unit = getUnit(to)

  const easing = normalizeEasing($easing)

  const { numbers: fromNumbers } = decompose(from)

  const { numbers: toNumbers, strings: toStrings, numeric } = decompose(to)

  const transform = <T extends AnimatableValue>(elapsed: number): T => {
    const mapping = interpolator.bind(null, easing(elapsed / $duration), [0, 1])

    const numbers = toNumbers.map((num, i) => mapping([fromNumbers[i], num]))

    if (numeric) return numbers[0] as T

    return toStrings.reduce((result, str, i) => {
      return `${result}${str}${numbers[i] ?? ''}`
    }, '') as T
  }

  return {
    get type() {
      return 'value'
    },

    get property() {
      return undefined as string | undefined
    },

    get unit() {
      return unit
    },

    get original() {
      return Object.freeze([from, to] as const)
    },

    get delay() {
      return options.delay
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

    get end() {
      return this.start + this.delay + this.duration
    },

    transform,
  }
}
 */
