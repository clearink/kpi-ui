import { hasOwn, isFunction } from '@kpi/shared'

export function getInlineStyle(element: Element, prop: string) {
  if (!('style' in element) || !hasOwn(element.style, prop)) return undefined
  return (element.style as CSSStyleDeclaration).getPropertyValue(prop)
}
export function getElementStyle(element: Element, prop: string) {
  if (!isFunction(getComputedStyle)) return getInlineStyle(element, prop)

  return getComputedStyle(element).getPropertyValue(prop)
}
