// 向 Form.Item 包裹的组件内部注入数据

import { isValidElement, cloneElement, useLayoutEffect, ReactElement } from 'react'
import { FormItemProps, PathItem } from '../props'
import { toChildrenArray } from '../../_utils/to_array'
import { useEvent } from '../../_hooks'
import type { FormFieldControl, FormGroupControl } from '../control/control'
import { isUndefined } from '../../_utils'

export default function useInjectField<State = any>(
  props: FormItemProps,
  parent?: FormGroupControl<State>
) {
  const { children, name, initialValue } = props
  // 1. 注入 valuePropName 同名属性
  // 2. 注入 trigger 同名事件
  // const childrenArray = toChildrenArray(children)

  // 默认值
  const handleSetInitialValue = useEvent(() => {
    if (!parent || !name) return
    const topInitial = parent.getFieldValue(name)

    const $initialValue = isUndefined(topInitial) ? initialValue : topInitial
    // TODO: 这里还要判断值是否相等 做下优化
    if (!isUndefined($initialValue)) parent.setFieldValue(name, $initialValue)
  })
  // initialValue 仅在组件挂载时生效一次
  useLayoutEffect(handleSetInitialValue, [handleSetInitialValue])

  if (isValidElement(children)) {
    const $props = children.props
    const handleChange = (event: Event) => {
      // 向parent中 setIns
      // 同步内部值
      const val = (event.target as HTMLInputElement).value
      parent?.setFieldValue(name, val)
      $props.onChange?.(event)
    }

    const value = parent?.getFieldValue(name)
    return cloneElement(children as ReactElement, { onChange: handleChange, value })
  }
  return children
}
