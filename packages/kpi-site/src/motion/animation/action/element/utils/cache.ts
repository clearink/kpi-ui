import { hasOwn } from '@kpi/shared'
import defineHidden from '../../../../utils/define_hidden'
import { $cache } from '../../../../utils/symbol'

import type { MotionValue } from '../../../../motion'
import type { AnimatableValue } from '../../../interface'

export function ensureElementMotionCache(element: Element) {
  if (hasOwn(element, $cache)) return

  defineHidden(element, $cache, new Map())
}

export function getElementMotionCache(element: Element) {
  ensureElementMotionCache(element)
  return element[$cache] as Map<string, MotionValue<AnimatableValue>>
}

export function setElementMotionCache(element, key: string, value: MotionValue) {
  const cache = getElementMotionCache(element)

  cache.set(key, value)
}
