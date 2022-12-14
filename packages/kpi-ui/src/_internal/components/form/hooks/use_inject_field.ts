import { cloneElement, type ReactElement } from 'react'
import { logger } from '../../../utils'
import normalizeChildren from '../utils/children'
import { collectFieldInjectProps } from '../utils/collect'

import type {
  InternalFormFieldProps,
  InternalFormInstance,
  InternalHookReturn,
} from '../internal_props'
import type { FormFieldControl } from '../control'

// 向 Form.Field 包裹的组件内部注入数据
export default function useInjectField(
  props: InternalFormFieldProps,
  formInstance: InternalFormInstance,
  control: FormFieldControl,
  internalHook?: InternalHookReturn
) {
  const { children: $children } = props

  // 收集注册到子组件的数据
  const collect = collectFieldInjectProps(props, formInstance, control, internalHook)

  // 处理 children
  const handleNormalize = normalizeChildren(collect(), formInstance, control)
  const { functional, children, valid } = handleNormalize($children)

  logger.error(!functional && !valid, 'Form.Field `children` is not valid react element.')
  if (functional || !valid) return children

  // 注入数据
  const injectProps = collect((children as ReactElement).props)
  return cloneElement(children as ReactElement, injectProps)
}
