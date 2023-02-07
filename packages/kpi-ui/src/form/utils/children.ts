import { cloneElement, isValidElement } from 'react'
import { isFunction, isNullish, isString } from '@kpi/shared'

import type { FormContextState } from '../../_internal/context'
import type {
  FormInstance,
  FormItemLabelExtraProps,
  FormItemLabelProps,
  FormItemProps,
} from '../props'
import isInvalidUsage from './usage'

// 格式化 FormItemLabel
export function normalizeLabelChildren(
  mergedProps: FormItemLabelProps & FormItemLabelExtraProps & FormContextState
) {
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
  formInstance: FormInstance,
  formItemId?: string
) {
  const { children } = props

  // 用法不合法不渲染数据
  if (isInvalidUsage(props)) return () => undefined

  if (isValidElement<HTMLInputElement>(children)) {
    if (isNullish(formItemId)) return children
    if (!isNullish(children.props.id)) return children
    return cloneElement(children, { id: formItemId })
  }

  if (isFunction(children)) return () => children(formInstance)

  return () => children
}
