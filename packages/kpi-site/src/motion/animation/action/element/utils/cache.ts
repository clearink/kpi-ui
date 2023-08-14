import { defineHidden } from '../../../../utils/define'
import { $cache } from '../../../../utils/symbol'

import type { AnimatableStyleProperty } from '../../../interface'

export default function getElementCache(element: Element) {
  if (!element[$cache]) defineHidden(element, $cache, {})

  return element[$cache] as Partial<Record<AnimatableStyleProperty, string>>
}
