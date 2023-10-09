// 强制回流
export default function reflow(el: Element) {
  const dom = el || document.documentElement || document.body
  return getComputedStyle(dom).opacity
}
