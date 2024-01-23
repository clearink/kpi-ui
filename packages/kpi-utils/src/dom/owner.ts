// types
import type { MayBe } from '@kpi-ui/types'

export function ownerDocument(node: MayBe<Node>) {
  return (node && node.ownerDocument) || document
}

export function ownerWindow(node: MayBe<Node>) {
  const root = ownerDocument(node)
  return root.defaultView || window
}
