import { convertUnit } from './unit'

import type { AnimateElementOptions, AnimateValueOptions, KeyframeTarget } from '../../../interface'

export function normalizeTransition(
  maybeOptions: AnimateElementOptions | undefined,
  defaultOptions: AnimateValueOptions
) {
  return maybeOptions ?? defaultOptions
}

export function normalizeTargets(element: Element, property: string, to: KeyframeTarget) {
  // to = [100, 300, '20vh', '40px', '20vw']
  // => to = [100, 300]
  // gsap 是直接生成多个 renderer 附加到 timeline 上
  convertUnit(element, property, to)
  // const propertiesCache = getElementMotionCache(element)
  // const cacheMotionValue = propertiesCache.get(property)
  // // 1. normalize Target
  // // 如果已经存在 直接创建 renderer 返回
  // if (cacheMotionValue) {
  //   //
  // }
  // // const from = cacheMotionValue ? cacheMotionValue.get() : getElementProperty()
  // // const from = motionValue(0)
  return []
}
