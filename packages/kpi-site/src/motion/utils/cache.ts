import type { MotionValue } from '../motion'

export const motionPromiseCache = new WeakMap<MotionValue, any>()

// TODO
// export const angleOrColorCache = new Map<string, string>()
// export const getAngleOrColorCache = (value: string) => {
//   if(angleOrColorCache.has(key)) return angleOrColorCache.get(key)!
// }

export const valueTweens = new WeakMap<Element, Map<string, MotionValue>>()
export function getElementCache(element: Element) {
  if (valueTweens.has(element)) return valueTweens.get(element)!

  const cache = new Map<string, MotionValue>()

  valueTweens.set(element, cache)

  return cache
}
