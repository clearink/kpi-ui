import { useConstant, useDeepMemo, useEvent } from '@kpi-ui/hooks'
import { isUndefined, toArray } from '@kpi-ui/utils'
import { Fragment, useEffect, useMemo } from 'react'
import { InternalFormInstanceContext } from '../../_shared/context'
import { _getName } from '../../utils/path'
import { HOOK_MARK } from '../form/control'
import useFieldControl from './hooks/use_field_control'
import useInjectField from './hooks/use_inject_field'

import type { ExternalFormFieldProps, InternalFormFieldProps } from './props'

function InternalFormField(props: InternalFormFieldProps) {
  const { name, dependencies, shouldUpdate } = props

  // 父级表单方法
  const instance = InternalFormInstanceContext.useState()

  const internalHook = useMemo(() => instance.getInternalHooks(HOOK_MARK)!, [instance])

  const [control, resetCount] = useFieldControl()

  control.setInternalFieldProps(props)

  // 设置初始值,减少一次 re-render
  useConstant(() => internalHook.ensureInitialized(control))

  // 注册子字段 销毁时移除该字段
  const registerField = useEvent(() => {
    if (shouldUpdate === true) control.forceUpdate()

    return internalHook.registerField(control)
  })
  useEffect(registerField, [registerField])

  // 监听依赖字段, 当依赖字段变更时，会执行 control 自身的校验函数
  const key = useDeepMemo(() => name, [name])
  const memorized = useDeepMemo(() => dependencies, [dependencies])
  const subscribe = useEvent(() => internalHook.subscribe(control))
  useEffect(subscribe, [subscribe, memorized, key])

  // 数据注入
  const children = useInjectField(props, instance, control, internalHook)

  return <Fragment key={resetCount}>{children}</Fragment>
}

export default function WrapperFormField(props: ExternalFormFieldProps) {
  const { name, isListField } = props

  const { listPath = [] } = InternalFormInstanceContext.useState()

  const path = isUndefined(name) ? [] : listPath.concat(toArray(name))

  const key = isListField ? 'keep' : _getName(path)

  return <InternalFormField key={key} {...props} name={path} />
}
