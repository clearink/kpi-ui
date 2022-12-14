import { isValidElement, type ReactElement } from 'react'
import { flattenChildren, isFunction } from '../../../utils'

import type { InnerReturn, InternalFormFieldProps, InternalFormInstance } from '../internal_props'
import type { AnyObject } from '../../../types'
import type { FormFieldControl } from '../control'

/** 格式化 Form.Field children */
export default function normalizeChildren(
  injectProps: AnyObject,
  formInstance: InternalFormInstance,
  control: FormFieldControl
) {
  return function normalizeInner(_children: InternalFormFieldProps['children']): InnerReturn {
    if (isFunction(_children)) {
      const renderProps = _children(injectProps, control.getFieldMeta(), formInstance)
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
