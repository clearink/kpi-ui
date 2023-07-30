import type { AnimateElementOptions, AnimateValueOptions, KeyframeTarget } from '../../../interface'

export function normalizeTransition(
  maybeOptions: AnimateElementOptions | undefined,
  defaultOptions: AnimateValueOptions
) {
  return maybeOptions ?? defaultOptions
}

export function normalizeTargets(element: Element, property: string, to: KeyframeTarget) {
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
