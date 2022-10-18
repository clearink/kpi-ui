// 向 Form.Field 包裹的组件内部注入数据

import { cloneElement, useEffect } from 'react'
import type { ReactElement } from 'react'
import { useMounted } from '../../_hooks'
import logger from '../../_utils/logger'
import normalizeChildren from '../utils/children'
import collectInjectProps from '../utils/collect'
import type {
  InternalFormFieldProps,
  InternalFormInstance,
  InternalHookReturn,
} from '../internal_props'
import type { FormFieldControl } from '../control/control'

export default function useInjectField(
  props: InternalFormFieldProps,
  context: InternalFormInstance,
  control: FormFieldControl,
  internalHook?: InternalHookReturn
) {
  const { children: $children, name, initialValue } = props

  // 设置默认值 仅挂载时有效

  const mounted = useMounted()
  // 仅设置field 不更新
  !mounted.current && internalHook?.ensureInitialized(name, initialValue)
  // useEffect(() => {
  //   // 获得全部controls 然后更新，前提是需要检查 state 是否有同名的值
  //   internalHook?.ensureInitialized(name, initialValue)
  // }, [initialValue, internalHook, name])

  // 收集注册到子组件的数据
  const collect = collectInjectProps(props, context, control)

  // NEXT 这个
  const fieldStatus = {}
  //  onMetaChange

  // 处理 children
  const handlerNormalize = normalizeChildren(collect(), fieldStatus, context)
  const { functional, children, valid } = handlerNormalize($children)

  // 不符合规范 要么 render props 要么只有一个合法的 ReactElement
  logger.warn(!valid && !functional, '`children` of Field is not validate ReactElement.')

  if (functional || !valid) return children

  const injectProps = collect((children as ReactElement).props)
  return cloneElement(children as ReactElement, injectProps)
}
