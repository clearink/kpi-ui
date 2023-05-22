import { pushItem } from '../../utils/array'
import { normalizeKeyframes } from '../utils/normalize'
import valueTween from './value'

import type { AnimatableValue, AnimationOptions, ElementKeyframes } from '../interface'
import type { Tween } from './interface'

export default function elementTweens<V extends AnimatableValue>(
  elements: Element[],
  keyframes: ElementKeyframes,
  options: Required<AnimationOptions<V>>
) {
  return elements.reduce((result: Tween[], element) => {
    // TODO: 需要解析keyframes 生成符合要求的 tween 才行
    // 1. 需要将 keyframes 的各个单位统一起来
    const [from, to] = normalizeKeyframes(element, keyframes)

    const tweens = Object.keys(to).map((key) => valueTween(from[key], to[key], options))

    return pushItem(result, tweens)
  }, [])
}
