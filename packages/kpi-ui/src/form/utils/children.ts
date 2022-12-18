import { cloneElement, isValidElement } from 'react'
import { isFunction, isString } from '../../_internal/utils'

import type { FormContextState } from '../../_internal/context'
import type { FormInstance, FormItemLabelProps, FormItemProps } from '../props'

// 格式化 FormItemLabel
export function normalizeLabelChildren(
  props: FormItemLabelProps,
  formContextState: FormContextState
) {
  const { colon, label, requiredMark, required, tooltip } = props
  const { vertical } = formContextState
  const hasColon = !vertical && colon

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
  children: FormItemProps['children'],
  formInstance: FormInstance,
  formItemId?: string
) {
  if (isValidElement<HTMLInputElement>(children)) {
    const originId = children.props.id
    return cloneElement(children, { id: originId ?? formItemId })
  }

  if (isFunction(children)) {
    return () => children(formInstance)
  }

  return () => children
}
