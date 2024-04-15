import { getElementStyle, ownerDocument } from '@kpi-ui/utils'

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

export function getRelativeElement(el: Element) {
  let parent = el.parentElement

  while (parent) {
    const { position } = getElementStyle(parent)

    if (position !== 'static') return parent

    parent = parent.parentElement
  }

  const doc = ownerDocument(el)

  return doc.documentElement || doc.body
}
