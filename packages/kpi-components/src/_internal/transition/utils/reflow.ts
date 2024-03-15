import { ownerDocument } from '@kpi-ui/utils'

// 强制回流
export default function reflow(el?: Element | null) {
  if (el) return getComputedStyle(el).opacity

  const doc = ownerDocument()

  return (doc.documentElement || doc.body).scrollTop
}
