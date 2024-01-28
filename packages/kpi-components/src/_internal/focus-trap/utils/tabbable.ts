// utils
import { TabbableQuery } from '../constants'

const isContentEditable = (node: HTMLElement) => {
  const attr = node.getAttribute('contenteditable')
  return attr === '' || attr === 'true'
}

function isInputHidden(el: HTMLElement) {
  const node = el as HTMLInputElement
  return node.tagName === 'INPUT' && node.type === 'hidden'
}

const hasTabIndex = (node: HTMLElement) => {
  const attr = node.getAttribute('tabindex') || ''
  return !Number.isNaN(parseInt(attr, 10))
}

function getTabIndex(node: HTMLElement) {
  const attr = node.tabIndex

  if (attr < 0) {
    const isSpecialNode = /^AUDIO|VIDEO|DETAILS$/.test(node.tagName)

    if ((isContentEditable(node) || isSpecialNode) && !hasTabIndex(node)) return 0
  }

  return attr
}

function isHidden(node: HTMLElement, cache = new WeakMap<HTMLElement, boolean>()) {
  let hidden = false

  if (cache.has(node)) hidden = cache.get(node)!
  else {
    const { display, visibility } = getComputedStyle(node)

    hidden = display === 'none' || visibility === 'hidden'
  }

  if (!hidden && node.parentElement) {
    // 不是隐藏 查看父元素
    hidden = isHidden(node.parentElement, cache)
  }

  cache.set(node, hidden)

  return hidden
}

function isFocusable(node: HTMLElement) {
  if ((node as HTMLInputElement).disabled || isInputHidden(node)) return false

  return getTabIndex(node) >= 0
}

export default function tabbable(container: HTMLElement) {
  const nodes = container.querySelectorAll<HTMLElement>(TabbableQuery)

  return Array.from(nodes).filter((el) => !isHidden(el) && isFocusable(el))
}
