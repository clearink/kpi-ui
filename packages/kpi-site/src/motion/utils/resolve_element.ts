import { isString, logger } from '@kpi/shared'

export type ElementOrSelector = Element | Element[] | NodeListOf<Element> | string
export interface SelectorScope {
  current: any
  [key: string]: any
}
export default function resolveElements(elements: ElementOrSelector, scope?: SelectorScope) {
  if (isString(elements)) {
    const root: Element = scope ? scope.current : document

    logger(!!scope && !root, 'Scope provided, but no element detected.')

    return Array.from(root.querySelectorAll(elements))
  }

  if (elements instanceof Element) return Array.from([elements])

  return Array.from(elements || [])
}
