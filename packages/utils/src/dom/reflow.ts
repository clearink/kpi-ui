import { ownerDocument } from './global'

// 强制回流
export function reflow(el?: Element | null) {
  if (el) return getComputedStyle(el).opacity

  const doc = ownerDocument()

  return (doc.documentElement || doc.body).scrollTop
}
