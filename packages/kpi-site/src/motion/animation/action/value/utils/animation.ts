import { pushItem } from '@kpi/shared'
import decompose from '../../../../utils/decompose'

import type { AnimatableValue } from '../../../interface'
import type { TweenAnimation } from '../../../scheduler/animation'

class MotionAnimation<V extends AnimatableValue = AnimatableValue> implements TweenAnimation {
  private initialized = false

  tuple: TweenAnimation['tuple'] = [decompose(0), decompose(0)]

  ensureInitialized: TweenAnimation['ensureInitialized']

  constructor(from: V, to: V) {
    this.ensureInitialized = () => {
      if (this.initialized) return

      this.initialized = true

      this.tuple = [decompose(from), decompose(to)]
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
