import { getElementStyle, ownerDocument } from '@kpi-ui/utils'

export function isScrollable(el: Element) {
  return ['scrollTop', 'scrollLeft'].some((property) => {
    if (el[property]) return true

    el[property] = 1e10

    const result = el[property]

    if (result) el[property] = 0

    return !!result
  })
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
