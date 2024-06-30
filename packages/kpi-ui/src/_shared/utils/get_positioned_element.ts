import { getElementStyle, ownerDocument } from '@kpi-ui/utils'

export function getPositionedElement(el: Element) {
  let parent = el.parentElement

  while (parent) {
    const { position } = getElementStyle(parent)

    if (position !== 'static') return parent

    parent = parent.parentElement
  }

  const root = ownerDocument(el)

  return root.documentElement || root.body
}
