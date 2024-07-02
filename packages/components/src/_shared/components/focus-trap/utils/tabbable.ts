import { getElementStyle } from '@kpi-ui/utils'

import { TabbableQuery } from '../constants'

function isContentEditable(node: HTMLElement) {
  const attr = node.getAttribute('contenteditable')
  return attr === '' || attr === 'true'
}

function isInputHidden(el: HTMLElement) {
  const node = el as HTMLInputElement
  return node.tagName === 'INPUT' && node.type === 'hidden'
}

function hasTabIndex(node: HTMLElement) {
  const attr = node.getAttribute('tabindex') || ''
  return !Number.isNaN(Number.parseInt(attr, 10))
}

function getTabIndex(node: HTMLElement) {
  const attr = node.tabIndex

  if (attr < 0) {
    const isSpecialNode = /^AUDIO|VIDEO|DETAILS$/.test(node.tagName)

    if ((isContentEditable(node) || isSpecialNode) && !hasTabIndex(node)) return 0
  }

  return attr
}

function isHidden(node: HTMLElement, cache: WeakMap<HTMLElement, boolean>) {
  if (cache.has(node)) return cache.get(node)!

  const { display, visibility } = getElementStyle(node)

  let hidden = display === 'none' || visibility === 'hidden'

  const parent = node.parentElement

  // 递归查看父元素
  hidden = !hidden && parent ? isHidden(parent, cache) : hidden

  cache.set(node, hidden)

  return hidden
}

function isFocusable(node: HTMLElement) {
  if ((node as HTMLInputElement).disabled || isInputHidden(node)) return false

  return getTabIndex(node) >= 0
}

export default function tabbable(container: HTMLElement) {
  const nodes = container.querySelectorAll<HTMLElement>(TabbableQuery)

  const nodeCache = new WeakMap<HTMLElement, boolean>()

  return Array.from(nodes).filter(el => !isHidden(el, nodeCache) && isFocusable(el))
}
