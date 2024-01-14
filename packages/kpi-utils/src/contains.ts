import { isFunction } from './is'

export default function contains(root: Node | null | undefined, node: Node | null | undefined) {
  if (!root || !node) return false

  if (isFunction(root.contains)) return root.contains(node)

  let current: Node | null = node

  while (current) {
    if (current === root) return true
    current = current.parentNode
  }
  return false
}
