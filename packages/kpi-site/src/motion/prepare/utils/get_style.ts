import { hasOwn, isFunction, isNull } from '@kpi/shared'

export function getComputedCSS(element: Element, prop: string) {
  if (!isFunction(getComputedStyle)) return null

  return getComputedStyle(element)[prop] as string
}

export function getInlineCSS(element: Element, prop: string) {
  if ('style' in element && hasOwn(element.style, prop)) {
    return (element.style as CSSStyleDeclaration)[prop] as string
  }
}
export function getElementStyle(element: Element, prop: string) {
  const computed = getComputedCSS(element, prop)

  return !isNull(computed) ? computed : getInlineCSS(element, prop)
}
