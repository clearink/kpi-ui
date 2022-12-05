import { isValidElement, type ReactElement, type ReactNode } from 'react'
import { flattenChildren, isFunction, logger } from '../../_utils'

import type { InternalFormFieldProps, InternalFormInstance } from '../internal_props'
import type { AnyObject } from '../../_types'
import type { FormFieldControl } from '../control'

export interface InnerReturn {
  functional?: true
  valid?: boolean
  children: ReactNode
}

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

/**
 * 1. shouldUpdate 与 dependencies // 同时存在 "`shouldUpdate` and `dependencies` shouldn't be used together."
 * 2. render props && _key 使用 // render props 不应该成为一个 field(name 不应该和 render props 一起使用)
 * 3. render props && !(shouldUpdate || dependencies) // render props 只能与 shouldUpdate ，dependencies 一起使用
 * 4. 使用 dependencies 时必须设置 name 或者使用 render props
 */
/** 用法是否不合法 上层封装时使用 */
export function isInvalidUsage(
  control: FormFieldControl,
  functional: boolean | undefined,
  shouldUpdate: InternalFormFieldProps['shouldUpdate'],
  dependencies: InternalFormFieldProps['dependencies'] = []
) {
  if (control._key && functional) {
    // render props 时不能设置 name, Form.List 除外
    logger.error(
      true,
      'Form.Field',
      "Do not use `name` with `children` of render props since it's not a field."
    )
    return true
  }
  if (shouldUpdate && dependencies.length) {
    // shouldUpdate dependencies 不能同时使用
    logger.error(
      true,
      'Form.Field',
      "`shouldUpdate` and `dependencies` shouldn't be used together."
    )
    return true
  }

  if (functional && !(shouldUpdate || dependencies.length)) {
    // render props 时必须设置 shouldUpdate， dependencies 中的一个
    logger.error(
      true,
      'Form.Field',
      '`children` of render props only work with `shouldUpdate` or `dependencies`.'
    )
    return true
  }

  if (dependencies.length && !(functional || control._key)) {
    // dependencies 仅在 render props 或者 name 合法时使用
    logger.error(
      true,
      'Form.Field',
      'Must set `name` or use render props when `dependencies` is set.'
    )
    return true
  }
  return false
}
