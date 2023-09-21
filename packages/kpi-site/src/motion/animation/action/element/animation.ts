import { isNull, pushItem } from '@kpi/shared'
import decompose from '../../../utils/decompose'
import { TweenAnimation } from '../../scheduler'
import { getUnit } from './utils/unit'

import type { AnimatableValue, GenericKeyframes } from '../../interface'

export default function makeAnimations(
  element: HTMLElement,
  accessor: { get: () => string },
  keyframes: GenericKeyframes<AnimatableValue>
) {
  return keyframes.reduce((targets, keyframe, i) => {
    if (i === 0) return targets

    const animation = new TweenAnimation(keyframes[i - 1], keyframe)

    animation.init = () => {
      animation.initialized = true

      // 1. 去除 null 的影响
      animation.from = isNull(animation.from) ? accessor.get() : animation.from

      animation.to = isNull(animation.to) ? animation.from : animation.to

      // 2. 进行单位转换(一些特殊值不需要添加单位如 auto, none)

      animation.tuple[0] = decompose(animation.from)

      animation.tuple[1] = decompose(animation.to)

      // // 3. 给 tuple 赋值

      // // animation.tuple[0] =

      // // animation.tuple[1] =
      // /**
      //  * 1. 确定单位
      //  * 2. 进行单位转换
      //  * 3. 赋值
      //  */

      // // 获取当前值，以及 单位
      // const unit = getUnit(accessor.get())

      // // convertUnit()

      // animation.from = `${animation.from}${unit}`
      // animation.to = `${animation.to}${unit}`

      // // 如果二者单位不一致，需要进行单位转换

      // animation.tuple[0] = decompose(animation.from)
      // animation.tuple[1] = decompose(animation.to)
    }

    return pushItem(targets, animation)
  }, [] as TweenAnimation[])
}
