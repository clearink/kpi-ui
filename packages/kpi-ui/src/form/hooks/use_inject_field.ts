// 向 Form.Item 包裹的组件内部注入数据

import {
  isValidElement,
  cloneElement,
  ReactElement,
  useEffect,
  useCallback,
  ReactNode,
} from 'react'
import { useEvent } from '../../_hooks'
import { flattenChildren, isFunction } from '../../_utils'
import type { FormFieldProps } from '../props'
import type { FormGroupControl } from '../control/control'

export default function useInjectField<State = any>(
  props: FormFieldProps,
  parent?: FormGroupControl<State>
) {
  const { children, name, initialValue } = props
  // 1. 注入 valuePropName 同名属性
  // 2. 注入 trigger 同名事件
  // const childrenArray = toChildrenArray(children)

  // 设置默认值
  useEffect(() => {
    parent?.ensureFieldInitial(name, initialValue)
  }, [initialValue, name, parent])

  const handler = useCallback((_children: ReactNode) => {
    // render props 方式
    if (isFunction(_children)) {
      return {
        functional: true,
        // todo
        ...handler(_children(getInjectProps, getMeta, context)),
      }
    }
    const childList = flattenChildren(_children)
    // 多个元素 或者 第一个元素不是 reactElement
    if (childList.length !== 1 || !isValidElement(childList[0])) {
      return { child: childList, functional: false }
    }
    return { child: childList[0], functional: false }
  }, [])

  // 处理 children
  // const handler = useEvent((_children: ReactNode) => {
  //   if (isFunction(_children)) {
  //     // render props 方式
  //     return {
  //       functional: true,
  //       ...handler(_children()),
  //     }
  //   }
  //   const childList = toChildrenArray(_children)
  //   if (chilnList.length !== 1 || !isValidElement(childList[0])) {
  //     return { child: childList, functional: false }
  //   }
  //   return { child: childList[0], functional: false }
  // })

  if (!isValidElement(children)) return children

  // NEXT: 处理这里
  const $props = children.props
  const handleChange = (event: Event) => {
    // 同步内部值
    const val = (event.target as HTMLInputElement).value
    parent?.setFieldValue(name, val)
    parent?.get(name)?.forEach(($control) => $control.validate(val))
    $props.onChange?.(event)
  }

  const value = parent?.getFieldValue(name)
  return cloneElement(children as ReactElement, { onChange: handleChange, value })
}
