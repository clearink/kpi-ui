import { ownerDocument } from '@kpi-ui/utils'
import { TabbableQuery } from '../constants'

export function hasTabIndex() {}
export function getTabbable() {}
export function isHTMLElement(node: Node) {
  return node instanceof HTMLElement
}
export function isInputNode(el: Element) {
  return el instanceof HTMLElement
}
export function isInputHidden() {}
export function isHidden() {}

export function isFocusable(node: HTMLElement) {
  return true
}
export function tabbable(container: HTMLElement) {
  const nodes = container.querySelectorAll<HTMLElement>(TabbableQuery)

  return Array.from(nodes).filter(isFocusable)
  // const root = ownerDocument(container)
  // const original = root.activeElement
}
