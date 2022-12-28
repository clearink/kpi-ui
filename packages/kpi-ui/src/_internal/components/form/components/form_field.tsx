import { useRef, Fragment, useReducer, useMemo } from 'react'

import { withDefaultProps } from '../../../hocs'
import { FieldContext } from '../../../context/_internal'
import { FormFieldControl, HOOK_MARK } from '../control'

import useInjectField from '../hooks/use_inject_field'
import { useDeepMemo, useIsomorphicEffect, useMounted } from '../../../hooks'
import { isUndefined, toArray } from '../../../utils'
import { _getName } from '../utils/path'

import type { FormFieldProps } from '../props'
import type { InternalFormFieldProps as InternalProps } from '../internal_props'

function InternalFormField(props: InternalProps) {
  const { dependencies } = props

  // 重置次数
  const [resetCount, resetField] = useReducer((count) => count + 1, 0)

  // 强制更新视图
  const [, forceUpdate] = useReducer((count) => count + 1, 0)

  // 父级表单方法
  const formInstance = FieldContext.useState()

  const internalHook = useMemo(() => formInstance.getInternalHooks(HOOK_MARK), [formInstance])

  const mounted = useMounted()
  const control = useRef<FormFieldControl>()
  if (!control.current) control.current = new FormFieldControl(forceUpdate, resetField, mounted)
  // 同步props性到 fieldControl
  control.current.setFieldProps(props)

  // 注册子字段 销毁时移除该字段
  useIsomorphicEffect(() => internalHook?.registerField(control.current!), [internalHook])

  // 监听依赖字段, 当依赖字段变更时，会执行 control 自身的校验函数
  const memorized = useDeepMemo(() => dependencies, [dependencies])
  useIsomorphicEffect(
    () => internalHook?.registerSubscribe(control.current!),
    [internalHook, memorized]
  )

  // 数据注入
  const children = useInjectField(props, formInstance, control.current, internalHook)

  return <Fragment key={resetCount}>{children}</Fragment>
}

function WrapperFormField(props: FormFieldProps) {
  const { name, ...rest } = props
  // 用于 Form.List 组件
  const { parentNamePath = [] } = FieldContext.useState()

  // 预处理一下 name 字段
  const namePath = isUndefined(name) ? [] : parentNamePath.concat(toArray(name))

  const key = rest.isListField ? 'keep' : _getName(namePath)

  // 由于这里根据 name 设置了 key
  return <InternalFormField key={key} name={namePath} {...rest} />
}

export default withDefaultProps(WrapperFormField, {
  valuePropName: 'value',
  trigger: 'onChange',
  shouldUpdate: false,
  validateFirst: false,
} as const)
