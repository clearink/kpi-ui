import { pushItem } from '@kpi/shared'
import decompose from '../../../../utils/decompose'
import { TweenAnimation } from '../../../scheduler'

import type { AnimatableValue } from '../../../interface'

export default function makeAnimations<V extends AnimatableValue>(keyframes: V[]) {
  return keyframes.reduce((result, keyframe, i) => {
    if (i === 0) return result

    const animation = new TweenAnimation(keyframes[i - 1], keyframe)

    // 设置 init 函数
    animation.init = () => {
      animation.initialized = true

      animation.tuple[0] = decompose(animation.from)
      animation.tuple[1] = decompose(animation.to)
    }

    return pushItem(result, animation)
  }, [] as TweenAnimation[])
}
