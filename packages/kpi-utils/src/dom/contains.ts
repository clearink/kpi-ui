// utils
import { isFunction } from '../is'
// types
import type { MayBe } from '@kpi-ui/types'

// 包含
export default function contains(root: MayBe<Node>, node: MayBe<Node>) {
  if (!root || !node) return false

  if (isFunction(root.contains)) return root.contains(node)

  let current: Node | null = node

  while (current) {
    if (current === root) return true
    current = current.parentNode
  }
  return false
}
