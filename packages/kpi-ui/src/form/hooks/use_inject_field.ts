// 向 Form.Field 包裹的组件内部注入数据

import { cloneElement } from 'react'
import type { ReactElement } from 'react'
import { useEvent, useIsomorphicEffect } from '../../_hooks'
import { logger } from '../../_utils'
import normalizeChildren from '../utils/children'
import collectInjectProps from '../utils/collect'
import type {
  InternalFormFieldProps,
  InternalFormInstance,
  InternalHookReturn,
} from '../internal_props'
import type { FormFieldControl } from '../control'

export default function useInjectField(
  props: InternalFormFieldProps,
  context: InternalFormInstance,
  control: FormFieldControl,
  internalHook?: InternalHookReturn
) {
  const { children: $children, name, initialValue } = props

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

  // 不符合规范 要么 render props 要么只有一个合法的 ReactElement
  logger.warn(!valid && !functional, '`children` of Field is not validate ReactElement.')

  if (functional || !valid) return children

  const injectProps = collect((children as ReactElement).props)
  return cloneElement(children as ReactElement, injectProps)
}

/**
 * QA
 * Q: 校验应该是字段级的，这样能够提高性能
 * A: kfc 实现 validateAt 功能
 *
 * Q: meta 属性究竟要怎么维护？
 * A: 放到 formGroup 里还是各个 control 自己独立维护呢？
 * touched 是否触摸过 以是否触发过 blur 事件为准
 * errors 错误信息
 * dirty 是否修改过值 以是否与源数据相对为准
 */
