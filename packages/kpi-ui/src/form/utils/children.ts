import { isValidElement, type ReactElement, type ReactNode } from 'react'
import { flattenChildren, isFunction } from '../../_utils'
import type { InternalFormFieldProps, InternalFormInstance } from '../internal_props'
import type { AnyObject } from '../../_types'

export interface InnerReturn {
  functional?: true
  valid?: boolean
  children: ReactNode
}

/** 格式化 Form.Field children */
export default function normalizeChildren(
  injectProps: AnyObject,
  fieldStatus: AnyObject,
  context: InternalFormInstance
) {
  return function normalizeInner(_children: InternalFormFieldProps['children']): InnerReturn {
    if (isFunction(_children)) {
      const renderProps = _children(injectProps, fieldStatus, context) as ReactElement
      return { ...normalizeInner(renderProps), functional: true }
    }

    // 去除 fragment，nullish 后
    const childList = flattenChildren(_children)

    // Form.Field 直接包裹的元素，且是 合法的 reactELement
    if (childList.length === 1 && isValidElement(childList[0])) {
      return { valid: true, children: childList[0] }
    }
    return { valid: false, children: childList }
  }
}
