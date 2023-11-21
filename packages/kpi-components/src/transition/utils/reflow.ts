// 强制回流
export default function reflow(el?: Element | null) {
  if (el) return getComputedStyle(el).opacity

  const root = document.documentElement || document.body

  return root.scrollTop
}
