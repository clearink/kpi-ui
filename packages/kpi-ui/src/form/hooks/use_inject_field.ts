// 向 Form.Item 包裹的组件内部注入数据

import type { SyntheticEvent, FormEventHandler } from 'react'
import { FormItemProps } from '../props'
import { toChildrenArray } from '../../_utils/to_array'

export default function useInjectField(props: FormItemProps) {
  const { children } = props
  // 1. 注入 valuePropName 同名属性
  // 2. 注入 trigger 同名事件
  // const childrenArray = toChildrenArray(children)
  return children
}
