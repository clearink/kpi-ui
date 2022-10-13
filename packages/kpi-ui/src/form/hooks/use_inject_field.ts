// 向 Form.Item 包裹的组件内部注入数据

import { isValidElement, cloneElement, ReactElement, useLayoutEffect } from 'react'
import { FormItemProps } from '../props'
import { toChildrenArray } from '../../_utils/to_array'
import { useEvent, useMounted } from '../../_hooks'
import type { FormGroupControl } from '../control/control'
import { isUndefined } from '../../_utils'
import logger from '../../_utils/logger'

export default function useInjectField<State = any>(
  props: FormItemProps,
  parent?: FormGroupControl<State>
) {
  const { children, name, initialValue } = props
  // 1. 注入 valuePropName 同名属性
  // 2. 注入 trigger 同名事件
  // const childrenArray = toChildrenArray(children)

  // 设置默认值
  parent?.ensureFieldInitial(name, initialValue)

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

function useBeforeMount(handler: () => void) {
  const mounted = useMounted()
  if (!mounted.current) handler()
}
