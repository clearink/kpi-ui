import { cloneElement, type ReactElement } from 'react'
import { useEvent, useIsomorphicEffect } from '../../_hooks'
import { logger } from '../../_utils'
import normalizeChildren, { isInvalidUsage } from '../utils/children'
import collectInjectProps from '../utils/collect'

import type {
  InternalFormFieldProps,
  InternalFormInstance,
  InternalHookReturn,
} from '../internal_props'
import type { FormFieldControl } from '../control'

// 向 Form.Field 包裹的组件内部注入数据

export default function useInjectField(
  props: InternalFormFieldProps,
  context: InternalFormInstance,
  control: FormFieldControl,
  internalHook?: InternalHookReturn
) {
  const { children: $children, name, initialValue, shouldUpdate, dependencies } = props

  // 设置默认值
  // name 是数组会导致额外的 rerender 所以使用了useEvent
  const ensureInitialized = useEvent(() => {
    internalHook?.ensureInitialized(name, initialValue)
  })
  useIsomorphicEffect(ensureInitialized, [ensureInitialized])

  // 收集注册到子组件的数据
  const collect = collectInjectProps(props, context, control, internalHook)

  // 处理 children
  const handlerNormalize = normalizeChildren(collect(), context, control)
  const { functional, children, valid } = handlerNormalize($children)

  // 不规范的用法
  if (isInvalidUsage(control, functional, shouldUpdate, dependencies)) {
    return null
  }

  logger.error(!functional && !valid, 'Form.Field `children` is not valid element.')
  if (functional || !valid) return children

  // 注入数据
  const injectProps = collect((children as ReactElement).props)
  return cloneElement(children as ReactElement, injectProps)
}
