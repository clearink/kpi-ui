import { getClientCoords, getElementStyle } from '@kpi-ui/utils'
import { getPositionedElement } from '_shared/utils'

function isScrollable(el: Element) {
  const { overflow: o, overflowX: ox, overflowY: oy } = getElementStyle(el)

  const builtin = ['auto', 'scroll', 'hidden', 'clip']

  return builtin.includes(o) || builtin.includes(ox) || builtin.includes(oy)
}

export function getScrollElements(element: Element) {
  const elements: HTMLElement[] = []

  let current = element.parentElement

  while (current) {
    if (isScrollable(current)) elements.push(current)

    current = current.parentElement
  }

  return elements
}

export function getElementCoords(el: HTMLElement) {
  const coords = getClientCoords(el)

  return {
    /** clientHeight */
    _height: el.clientHeight,
    /** clientWidth */
    _width: el.clientWidth,
    bottom: coords.bottom,
    el,
    height: coords.height,
    left: coords.left,
    right: coords.right,
    top: coords.top,
    width: coords.width,
  }
}

export function getPositionedCoords(el: Element) {
  return getElementCoords(getPositionedElement(el))
}
