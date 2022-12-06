import { useRef, Fragment, useReducer, useMemo } from 'react'

import { withDefaultProps } from '../../.internal/hocs'
import { FieldContext } from '../../.internal/context'
import { FormFieldControl, HOOK_MARK } from '../control'

import useInjectField from '../hooks/use_inject_field'
import { useDeepMemo, useEvent, useIsomorphicEffect, useMounted } from '../../.internal/hooks'
import { isUndefined, toArray } from '../../.internal/utils'
import { _getName } from '../utils/path'

import type { FormFieldProps } from '../props'
import type { InternalFormFieldProps } from '../internal_props'

function InternalFormField(props: InternalFormFieldProps) {
  const { name, dependencies } = props
  // 重置次数
  const [resetCount, resetField] = useReducer((count) => count + 1, 0)

  // 强制更新视图
  const [, forceUpdate] = useReducer((count) => count + 1, 0)

  // 父级表单
  const formInstance = FieldContext.useState()
  const internalHook = useMemo(() => {
    return formInstance.getInternalHooks(HOOK_MARK)
  }, [formInstance])

  const control = useRef(new FormFieldControl(name, forceUpdate, resetField, useMounted()))
  // 同步props性到 fieldControl
  control.current.setFieldProps(props)

  // 注册子字段 销毁时移除该字段
  // name 是数组会导致额外的 rerender 所以使用了useEvent
  const registerField = useEvent(() => {
    return internalHook?.registerField(control.current)
  })
  useIsomorphicEffect(registerField, [registerField])

  // 监听依赖字段, 当依赖字段变更时，会执行 control 自身的校验函数
  // name 是数组会导致额外的 rerender 所以使用了useEvent
  // dependencies 进行深度比较
  const memorized = useDeepMemo(() => dependencies, [dependencies])
  const subscribe = useEvent(() => {
    const unsubscribe = internalHook?.registerSubscribe(control.current)
    return unsubscribe
  })
  useIsomorphicEffect(subscribe, [subscribe, memorized])

  // 数据注入
  const $children = useInjectField(props, formInstance, control.current, internalHook)

  return <Fragment key={resetCount}>{$children}</Fragment>
}

function WrapperFormField($props: FormFieldProps) {
  const { name, ...rest } = $props
  // 用于 Form.List 组件
  const { parentNamePath = [] } = FieldContext.useState()

  // 预处理一下 name 字段
  const [namePath, key] = useDeepMemo(() => {
    const path = isUndefined(name) ? [] : parentNamePath.concat(toArray(name))
    return [path, `_${_getName(path)}`] as const
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
