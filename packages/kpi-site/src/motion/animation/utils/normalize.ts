import { isArray, isFunction, isNull, isString } from '@kpi/shared'
import { cubicBezier, eases } from '../../easing'
import { cubicBezierCache } from '../../utils/cache'
import attr from '../../parse/attr'
import css from '../../parse/css'
import transform from '../../parse/transform'

import type { Easing } from '../../easing/interface'
import type { AnimatableValue, ElementKeyframes, GenericKeyframes } from '../interface'

// 解析缓动函数
export const normalizeEasing = (easing?: Easing) => {
  if (isFunction(easing)) return easing

  if (isArray(easing) && easing.length === 4) {
    const key = easing.join('$')

    if (!cubicBezierCache.has(key)) cubicBezierCache.set(key, cubicBezier(...easing))

    return cubicBezierCache.get(key)!
  }

  if (isString(easing) && eases[easing]) return eases[easing]

  return eases.linear
}

export const normalizeTweenTarget = <V extends AnimatableValue>(
  from: V,
  to: V | GenericKeyframes<V>
): V[] => {
  if (!isArray(to)) return [from, to]

  return to.map((item, i) => (i === 0 && isNull(item) ? from : item))
}

export const normalizeTweenTimes = <V extends AnimatableValue>(target: V[], times: number[]) => {
  const steps = target.length

  if (steps === times.length) return times

  const resolved = [0]

  for (let i = 0; i < steps - 1; i += 1) {
    resolved.push((1 / (steps - 1)) * (i + 1))
  }

  return resolved
}

// 格式化 element 动效值
export const normalizeKeyframes = (element: Element, keyframes: ElementKeyframes) => {
  // 先进行 transform 的转换 将 x,y 转换成合法的数据
  console.log(keyframes) // {x: 200, y: 300}

  // 记录 transform 
  const list = new Map<string, any>()
  // 1. 组合全部的 transform 属性成一个字符串
  // 2. 
  Object.keys(keyframes).forEach((key) => {
    if (transform.test(key)) {
      return transform.transform(transform.parse(element, key))
    }
    if (attr.test(element, key)) {
      return attr.
    } else if (css.test(element, key)) {
      //
    }
    // tweens.push(valueTween())
  })
  const from = {}
  const to = {}

  return [from, to] as const
}
