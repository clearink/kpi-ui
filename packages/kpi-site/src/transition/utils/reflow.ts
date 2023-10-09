// 强制回流
export default function reflow(node: Element) {
  const dom = node || document.documentElement || document.body
  return getComputedStyle(dom).opacity
}
