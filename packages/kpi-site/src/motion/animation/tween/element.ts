import { pushItem } from '../../utils/array'
import valueTween from './value'
import { groupTransformKeyframes } from './adaptor'

import type { AnimatableValue, AnimationOptions, ElementKeyframes } from '../interface'
import type { Tween } from './interface'

export default function elementTweens<V extends AnimatableValue>(
  elements: Element[],
  keyframes: ElementKeyframes,
  options: Required<AnimationOptions<V>>
) {
  return elements.reduce((result: Tween[], element) => {
    // const [from, to] = normalizeKeyframes(element, keyframes)
    // const from = parseKeyframes()
    // 1. 获取 transform 的 from, to 值生成 tween
    // 2. 获取除了 transform 的其它 from, to 值 生成 tweens
    // 3. 都 push 到 result 中

    groupTransformKeyframes(element, keyframes)

    // const tweens = Object.keys(to).map((key) => valueTween(from[key], to[key], options))

    return result
    // return pushItem(result, tweens)
  }, [])
}
