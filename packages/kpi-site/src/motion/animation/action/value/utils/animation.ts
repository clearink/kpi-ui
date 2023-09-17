import { pushItem } from '@kpi/shared'
import decompose from '../../../../utils/decompose'

import type { AnimatableValue } from '../../../interface'
import type { TweenAnimation } from '../../../scheduler/animation'
import interpolator from '../../../../utils/interpolator'
import sanitize from '../../../../utils/sanitize'

class MotionAnimation<V extends AnimatableValue = AnimatableValue> implements TweenAnimation {
  private initialized = false

  tuple: TweenAnimation['tuple'] = [decompose(0), decompose(0)]

  init: TweenAnimation['init']

  render: TweenAnimation['render']

  constructor(from: V, to: V) {
    this.init = () => {
      if (this.initialized) return

      this.initialized = true

      this.tuple = [decompose(from), decompose(to)]
    }

    this.render = (progress, next) => {
      const [start, end] = this.tuple

      if (progress === 0) return from

      if (progress === 1) return to

      const numbers = end.numbers.map((num, i) => next([start.numbers[i] || 0, num]))

      if (end.numeric) return numbers[0]

      return end.strings.reduce((r, s, i) => `${r + s}${numbers[i] ?? ''}`, '')
    }
  }
}

export default function makeAnimations<V extends AnimatableValue = AnimatableValue>(
  keyframes: V[]
) {
  return keyframes.reduce((result, keyframe, i) => {
    if (i === 0) return result
    return pushItem(result, new MotionAnimation(keyframes[i - 1], keyframe))
  }, [] as MotionAnimation[])
}
