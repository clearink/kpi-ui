import { Fragment, useMemo, useEffect } from 'react'
import { useDeepMemo, useEvent, isUndefined, toArray, useConstructor } from '@kpi/shared'
import { HOOK_MARK } from '../control'
import useInjectField from '../hooks/use_inject_field'
import { useFormFieldControl } from '../hooks/use_form'
import { FieldContext } from '../../context'
import { _getName } from '../utils/path'

import type { FormFieldProps } from '../props'
import type { InternalFormFieldProps as InternalProps } from '../internal_props'

function InternalFormField(props: InternalProps) {
  const { name, dependencies, shouldUpdate } = props

  // 父级表单方法
  const formInstance = FieldContext.useState()

  const internalHook = useMemo(() => formInstance.getInternalHooks(HOOK_MARK), [formInstance])

  const [control, resetCount] = useFormFieldControl()

  // 同步props性到 fieldControl
  control.setFieldProps(props)

  // 设置初始值,减少一次 re-render
  useConstructor(() => internalHook?.ensureInitialized(control))

  // 注册子字段 销毁时移除该字段
  const registerField = useEvent(() => {
    if (shouldUpdate === true) control.forceUpdate()

    return internalHook?.registerField(control)
  })
  useEffect(registerField, [registerField])

  // 监听依赖字段, 当依赖字段变更时，会执行 control 自身的校验函数
  const key = useDeepMemo(() => name, [name])
  const memorized = useDeepMemo(() => dependencies, [dependencies])
  const subscribe = useEvent(() => internalHook?.subscribe(control))
  useEffect(subscribe, [subscribe, memorized, key])

  // 数据注入
  const children = useInjectField(props, formInstance, control, internalHook)

  return <Fragment key={resetCount}>{children}</Fragment>
}

export default function WrapperFormField(props: FormFieldProps) {
  const { name, isListField } = props
  // 用于 Form.List 组件
  const { parentNamePath = [] } = FieldContext.useState()

  // 预处理一下 name 字段
  const namePath = isUndefined(name) ? [] : parentNamePath.concat(toArray(name))

  const key = isListField ? 'keep' : _getName(namePath)

  return <InternalFormField key={key} {...props} name={namePath} />
}
