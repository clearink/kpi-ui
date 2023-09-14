import { pushItem } from '@kpi/shared'
import decompose from '../../../../utils/decompose'

import type { AnimatableValue } from '../../../interface'
import type { TweenAnimation } from '../../../scheduler/animation'
import makeAccessor from './accessor'
import { getUnit } from './unit'

class ElementAnimation<V extends AnimatableValue = AnimatableValue> implements TweenAnimation {
  private initialized = false

  tuple: TweenAnimation['tuple'] = [decompose(0), decompose(0)]

  ensureInitialized: TweenAnimation['ensureInitialized']

  constructor(accessor: ReturnType<typeof makeAccessor>, from: V, to: V) {
    this.ensureInitialized = () => {
      if (this.initialized) return

      this.initialized = true

      const unit = getUnit(accessor.get())

      this.tuple = [decompose(`${from}${unit}`), decompose(`${to}${unit}`)]
    }
  }
}

export default function makeAnimations(
  accessor: ReturnType<typeof makeAccessor>,
  keyframes: string[]
) {
  return keyframes.reduce((targets, keyframe, i) => {
    if (i === 0) return targets
    return pushItem(targets, new ElementAnimation(accessor, keyframes[i - 1], keyframe))
  }, [] as ElementAnimation[])
}
