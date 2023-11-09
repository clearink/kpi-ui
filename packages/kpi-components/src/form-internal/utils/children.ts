import { flattenChildren, isFunction } from '@kpi-ui/utils'
import { ReactNode, isValidElement, type ReactElement } from 'react'
import { InternalFormFieldProps } from '../components/field/props'

import type { AnyObject } from '../../types'
import type { FormFieldControl } from '../components/field/control'
import type { InternalFormInstance } from '../components/form/control/props'

/** 格式化 Form.Field children */
export default function normalizeChildren(
  collectInject: () => AnyObject,
  instance: InternalFormInstance,
  control: FormFieldControl
) {
  return function normalizeInner(_children: InternalFormFieldProps['children']): {
    functional?: true
    valid: boolean
    children: ReactNode
  } {
    if (isFunction(_children)) {
      const element = _children(collectInject(), control.meta, instance)
      return { ...normalizeInner(element as ReactElement), functional: true }
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
