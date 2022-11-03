import { useRef, Fragment, useReducer, useMemo } from 'react'

import { withDefaultProps } from '../../_hocs'
import { FieldContext } from '../../_context'
import { FormFieldControl, HOOK_MARK } from '../control'

import useInjectField from '../hooks/use_inject_field'
import {
  useConstructor,
  useDeepMemo,
  useEvent,
  useIsomorphicEffect,
  useMounted,
} from '../../_hooks'
import { isUndefined, toArray } from '../../_utils'

import type { FormFieldProps } from '../props'
import type { InternalFormFieldProps } from '../internal_props'

function InternalFormField(props: InternalFormFieldProps) {
  const { name, dependencies, preserve, shouldUpdate } = props
  // 重置次数
  const [resetCount, resetField] = useReducer((count) => count + 1, 0)

  // 强制更新视图
  const [, forceUpdate] = useReducer((count) => count + 1, 0)

  // 父级表单
  const context = FieldContext.useState()
  const internalHook = useMemo(() => context.getInternalHooks(HOOK_MARK), [context])

  const control = useRef(new FormFieldControl(name, forceUpdate, useMounted()))
  // 同步props性到 fieldControl
  control.current.setFieldProps(props)

  // 注册子字段 销毁时移除该字段
  // name 是数组会导致额外的 rerender 所以使用了useEvent
  const registerField = useEvent(() => {
    const cancel = internalHook?.registerField(control.current)
    // 确保拿到最新的数据
    if (shouldUpdate === true) forceUpdate()
    return () => cancel?.(preserve)
  })
  useIsomorphicEffect(registerField, [registerField])

  // 监听依赖字段, 当依赖字段变更时，会执行 control 自身的校验函数
  // name 是数组会导致额外的 rerender 所以使用了useEvent
  // dependencies 进行深度比较
  const memorized = useDeepMemo(() => dependencies, [dependencies])
  const subscribe = useEvent(() => {
    const unsubscribe = internalHook?.subscribe(name, memorized)
    return unsubscribe
  })
  useIsomorphicEffect(subscribe, [subscribe, memorized])

  // 数据注入
  const $children = useInjectField(props, context, control.current, internalHook)

  return <Fragment key={resetCount}>{$children}</Fragment>
}

function WrapperFormField($props: FormFieldProps) {
  const { name, ...rest } = $props
  // 用于 Form.List 组件
  const { parentNamePath = [] } = FieldContext.useState()

  // 预处理一下 name 字段
  const [namePath, key] = useDeepMemo(() => {
    const path = isUndefined(name) ? [] : parentNamePath.concat(toArray(name))
    return [path, `_${FormFieldControl._getName(path)}`] as const
  }, [name, parentNamePath])

  const props = { key, name: namePath, ...rest }

  // 由于这里根据 name 设置了 key
  // name 改变会重新渲染一个新的组件，不需要在 InternalFormField 监听 name 了
  return <InternalFormField {...props} />
}

export default withDefaultProps(WrapperFormField, {
  valuePropName: 'value',
  trigger: 'onChange',
  shouldUpdate: false,
  validateFirst: false,
} as const)
