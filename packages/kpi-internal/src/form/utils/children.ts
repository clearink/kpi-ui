import { isValidElement, type ReactElement } from 'react'
import { flattenChildren, isFunction } from '@kpi/shared'

import type { InnerReturn, InternalFormFieldProps, InternalFormInstance } from '../internal_props'
import type { FormFieldControl } from '../control'
import type { AnyObject } from '../../types'

/** 格式化 Form.Field children */
export default function normalizeChildren(
  collectInject: () => AnyObject,
  formInstance: InternalFormInstance,
  control: FormFieldControl
) {
  return function normalizeInner(_children: InternalFormFieldProps['children']): InnerReturn {
    if (isFunction(_children)) {
      const renderProps = _children(collectInject(), control.meta, formInstance)
      return { ...normalizeInner(renderProps as ReactElement), functional: true }
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
