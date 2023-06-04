import { isString, logger } from '@kpi/shared'

import type { AnimationScope } from '../interface'

export type ElementOrSelector = Element | Element[] | NodeListOf<Element> | string

// 解析为元素数组
export default function selector(elements: ElementOrSelector, scope?: AnimationScope) {
  if (isString(elements)) {
    const root: Element = scope ? scope.current : document

    logger(!!scope && !root, 'Scope provided, but no element detected.')

    return root ? Array.from(root.querySelectorAll(elements)) : []
  }

  if (elements instanceof Element) return Array.from([elements])

  return Array.from(elements || [])
}
