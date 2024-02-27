import { ownerWindow } from '@kpi-ui/utils'

// 获取能够滚动的元素
export default function getScrollable(element: Element) {
  const scrollable: HTMLElement[] = []

  const builtin = ['hidden', 'scroll', 'auto', 'clip']

  let current = element.parentElement

  const root = ownerWindow(current)

  while (current) {
    const { overflow, overflowX: ox, overflowY: oy } = root.getComputedStyle(current)

    if (builtin.includes(overflow) || builtin.includes(ox) || builtin.includes(oy)) {
      scrollable.push(current)
    }

    current = current.parentElement
  }

  return scrollable
}
