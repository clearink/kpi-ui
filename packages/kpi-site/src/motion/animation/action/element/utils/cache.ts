import { hasOwn } from '@kpi/shared'
import defineHidden from '../../../../utils/define_hidden'
import { $cache } from '../../../../utils/symbol'

import type { MotionValue } from '../../../../motion'
import type { AnimatableValue } from '../../../interface'

export function ensureCache(element: Element) {
  if (hasOwn(element, $cache)) return

  defineHidden(element, $cache, new Map())
}

export function getCache(element: Element) {
  ensureCache(element)
  return element[$cache] as Map<string, MotionValue<AnimatableValue>>
}

export function setCache(element, key: string, value: MotionValue) {
  const cache = getCache(element)

  cache.set(key, value)
}
