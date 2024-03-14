import { getElementStyle, ownerDocument } from '@kpi-ui/utils'

export default function getPositionedElement(el: Element) {
  let parent = el.parentElement

  while (parent) {
    const { position } = getElementStyle(parent)

    if (position !== 'static') return parent

    parent = parent.parentElement
  }

  const doc = ownerDocument(el)

  return doc.documentElement || doc.body
}
