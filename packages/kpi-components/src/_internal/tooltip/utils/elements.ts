import { getClientCoords, getElementStyle, ownerDocument } from '@kpi-ui/utils'

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
    el,
    top: coords.top,
    right: coords.right,
    bottom: coords.bottom,
    left: coords.left,
    height: coords.height,
    width: coords.width,
    /** clientHeight */
    _height: el.clientHeight,
    /** clientWidth */
    _width: el.clientWidth,
  }
}

export function getPositionedCoords(el: Element) {
  let parent = el.parentElement

  while (parent) {
    const { position } = getElementStyle(parent)

    if (position !== 'static') return getElementCoords(parent)

    parent = parent.parentElement
  }

  const root = ownerDocument(el)

  return getElementCoords(root.documentElement || root.body)
}
