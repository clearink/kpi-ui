import { hasOwn, isFunction } from '@kpi/shared'

export default function getElementStyle(element: Element, prop: string): string | undefined {
  if (isFunction(globalThis.getComputedStyle)) {
    return globalThis.getComputedStyle(element)[prop]
  }

  if ('style' in element && hasOwn(element.style, prop)) {
    return (element.style as CSSStyleDeclaration)[prop]
  }
}
