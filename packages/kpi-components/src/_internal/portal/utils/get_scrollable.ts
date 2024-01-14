export default function getScrollable(el: HTMLElement) {
  const current: HTMLElement | null = el
  const root = document.body || document.documentElement

  // while (current) {
  //   if (current === root) return current
  //   // 判断是否滚动容器
  //   if (current.scrollHeight > current.clientHeight) return current
  //   // 判断是否设置了overflow: auto/scroll
  //   if (window.getComputedStyle(current).overflow !== 'visible') return false
  //   // 判断是否是根元素
  //   // 判断是否是定位元素
  //   if (getStyleComputedProperty(current, 'position') === 'fixed') return true
  //   // 判断是否是绝对定位元素
  //   if (getStyleComputedProperty(current, 'position') === 'absolute') return false

  //   current = current.parentElement
  // }

  return current
}
