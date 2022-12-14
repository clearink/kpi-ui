import { cloneElement, isValidElement, ReactElement } from 'react'
import { FormContext } from '../../_internal/context'
import { isInvalidUsage } from '../utils/children'

import type { FormItemProps } from '../props'
import { isFunction } from '../../_internal/utils'

// 向 Form.Item 包裹的组件内部 注入数据
export default function useInjectChildren(props: FormItemProps, formItemId?: string) {
  const { children } = props

  const { form: formInstance } = FormContext.useState()

  const functional = isFunction(children)

  // 不规范的用法 提示不合法
  if (isInvalidUsage(props, functional)) {
    return undefined
  }

  if (isValidElement<HTMLInputElement>(children)) {
    const originId = children.props.id
    return cloneElement(children, { id: originId ?? formItemId })
  }

  if (functional) {
    return () => children(formInstance!)
  }

  return () => children
}
