import { isFunction, logger, toArray } from '@kpi-ui/utils'
import { isValidElement } from 'react'

import type { FormItemProps } from '../components/item/props'

/**
 * 1. shouldUpdate 与 dependencies // 同时存在 "`shouldUpdate` and `dependencies` shouldn't be used together."
 * 2. render props && _key 使用 // render props 不应该成为一个 field(name 不应该和 render props 一起使用)
 * 3. render props && !(shouldUpdate || dependencies) // render props 只能与 shouldUpdate ，dependencies 一起使用
 * 4. 使用 dependencies 时必须设置 name 或者使用 render props
 */
// 用法是否不合法
export default function isInvalidUsage(props: FormItemProps) {
  const { name, shouldUpdate, children, dependencies = [] } = props

  const hasName = toArray(name).length

  const functional = isFunction(children)

  if (hasName && functional) {
    // render props 时不能设置 name, Form.List 除外
    logger(
      true,
      'Form.Item',
      "Do not use `name` with `children` of render props since it's not a field."
    )
    return true
  }

  if (shouldUpdate && dependencies.length) {
    logger(true, 'Form.Item', "`shouldUpdate` and `dependencies` shouldn't be used together.")
    return true
  }

  if (functional && !(shouldUpdate || dependencies.length)) {
    // render props 时必须设置 shouldUpdate， dependencies 中的一个
    logger(
      true,
      'Form.Item',
      '`children` of render props only work with `shouldUpdate` or `dependencies`.'
    )
    return true
  }

  if (dependencies.length && !(functional || hasName)) {
    // dependencies 仅在 render props 或者 name 合法时使用
    logger(true, 'Form.Item', 'Must set `name` or use render props when `dependencies` is set.')
    return true
  }

  if (hasName && !functional && !isValidElement(children)) {
    logger(
      true,
      'Form.Item',
      '`name` is only used for validate React element. If you are using Form.Item as layout display, please remove `name` instead. '
    )
    // 仅提示
    return false
  }
  return false
}
