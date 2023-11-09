import { isFunction, isNullish, isString } from '@kpi-ui/utils'
import { cloneElement, isValidElement } from 'react'
import isInvalidUsage from './usage'

import type { FormContextState } from '../_shared/context'
import type { FormInstance } from '../components/form/props'
import type { FormItemLabelProps } from '../components/item-label/props'
import type { FormItemProps } from '../components/item/props'

// 格式化 FormItemLabel
export function normalizeLabelChildren(mergedProps: FormItemLabelProps & FormContextState) {
  const { colon, label, requiredMark, required, tooltip, layout } = mergedProps
  const hasColon = layout !== 'vertical' && colon

  let labelNode = label

  if (hasColon && isString(labelNode) && labelNode.trim()) {
    // 去除用户输入的 colon
    labelNode = labelNode.replace(/[:|：]\s*$/, '')
  }
  // TODO: optional mark
  if (requiredMark === 'optional' && !required) {
    //
  }
  // TODO: tooltip
  if (tooltip) {
    //
  }

  return labelNode
}

// 格式化 FormItem.Children
export function normalizeItemChildren(
  props: FormItemProps,
  formInstance: FormInstance | undefined,
  itemFor: string | undefined
) {
  const { children } = props

  // 用法不合法不渲染数据
  if (isInvalidUsage(props)) return () => undefined

  if (isFunction(children)) return () => children(formInstance!)

  if (!isValidElement<HTMLInputElement>(children)) return () => children

  const originalFor = children.props.id

  if (isNullish(itemFor) || !isNullish(originalFor)) return children

  return cloneElement(children, { id: itemFor })
}
