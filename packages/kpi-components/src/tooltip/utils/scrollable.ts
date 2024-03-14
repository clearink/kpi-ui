import { getElementStyle } from '@kpi-ui/utils'

// 获取能够滚动的元素
const builtin = ['hidden', 'scroll', 'auto', 'clip']

export default function getScrollable(element: Element) {
  const scrollable: HTMLElement[] = []

  let current = element.parentElement

  while (current) {
    const { overflow, overflowX: ox, overflowY: oy } = getElementStyle(current)

    if (builtin.includes(overflow) || builtin.includes(ox) || builtin.includes(oy)) {
      scrollable.push(current)
    }

    current = current.parentElement
  }

  return scrollable
}
