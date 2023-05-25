import { hasOwn, isFunction, isNull } from '@kpi/shared'

export function getElementStyle(element: Element, prop: string): string | undefined {
  const computed = getComputedCSS(element, prop)

  return !isNull(computed) ? computed : getInlineCSS(element, prop)
}

export function getComputedCSS(element: Element, prop: string) {
  if (isFunction(globalThis.getComputedStyle)) {
    return globalThis.getComputedStyle(element)[prop]
  }
  return null
}

export function getInlineCSS(element: Element, prop: string): string | undefined {
  if ('style' in element && hasOwn(element.style, prop)) {
    return (element.style as CSSStyleDeclaration)[prop]
  }
  return undefined
}
