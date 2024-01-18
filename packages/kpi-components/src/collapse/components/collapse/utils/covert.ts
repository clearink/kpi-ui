// utils
import { Children, cloneElement, createElement, isValidElement } from 'react'
// comps
import CollapseItem from '../../item'
// types
import type { CollapseItemType, CollapseProps } from '../props'

export function convertItemsToNodes(items: CollapseItemType[]) {
  return items.map((item) => {
    return createElement(CollapseItem, { ...item, name: item.key })
  })
}

export function convertChildrenToNodes(children: CollapseProps['children']) {
  return Children.map(children, (child) => {
    if (!isValidElement(child)) return child

    const isCollapseItem = child.type === CollapseItem

    if (!isCollapseItem) return child

    return cloneElement(child)
  })
}
