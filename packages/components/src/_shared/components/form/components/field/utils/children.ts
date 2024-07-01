import type { AnyObject } from '@kpi-ui/types'
import { flattenChildren, isFunction } from '@kpi-ui/utils'
import { isValidElement, type ReactElement, type ReactNode } from 'react'

import type { InternalFormInstance } from '../../form/control/props'
import type { FormFieldControl } from '../control'
import { InternalFormFieldProps } from '../props'

/** 格式化 Form.Field children */
export default function normalizeChildren(
  collectInject: () => AnyObject,
  instance: InternalFormInstance,
  control: FormFieldControl,
) {
  return function normalizeInner(children: InternalFormFieldProps['children']): {
    functional?: true
    valid: boolean
    children: ReactNode
  } {
    if (isFunction(children)) {
      const element = children(collectInject(), control.meta, instance)
      return { ...normalizeInner(element as ReactElement), functional: true }
    }
    // 去除 fragment，nullish 后
    const childList = flattenChildren(children)

    // Form.Field 直接包裹的元素，且是 合法的 reactELement
    if (childList.length === 1 && isValidElement(childList[0])) {
      return { valid: true, children: childList[0] }
    }
    return { valid: false, children: childList }
  }
}
