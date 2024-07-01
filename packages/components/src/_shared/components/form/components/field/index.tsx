import { useConstant, useDeepMemo } from '_shared/hooks'
import { isUndefined, toArray, withDefaults } from '@kpi-ui/utils'
import { Fragment, useEffect, useMemo } from 'react'

import { InternalFormInstanceContext } from '../../_shared/context'
import { _getName } from '../../utils/path'
import { HOOK_MARK } from '../form/control'
import useFieldControl from './hooks/use_field_control'
import useInjectField from './hooks/use_inject_field'
import type { ExternalFormFieldProps, InternalFormFieldProps } from './props'

const defaultProps: Partial<InternalFormFieldProps> = {
  trigger: 'onChange',
  valuePropName: 'value',
}

function InternalFormField(_props: InternalFormFieldProps) {
  const props = withDefaults(_props, defaultProps)

  // 父级表单方法
  const instance = InternalFormInstanceContext.useState()

  const internalHooks = useMemo(() => instance.getInternalHooks(HOOK_MARK)!, [instance])

  const [control, resetCount] = useFieldControl()

  control.setInternalFieldProps(props)

  // 设置初始值,减少一次 re-render
  useConstant(() => internalHooks.ensureInitialized(control))

  // 注册子字段 销毁时移除该字段
  useEffect(() => internalHooks.registerField(control), [control, internalHooks])

  // 监听依赖字段, 当依赖字段变更时，会执行 control 自身的校验函数
  // 当 dependencies 改变时，重新订阅
  // name 属性变化会直接重新mount，在此处不用考虑
  const key = useDeepMemo(() => props.dependencies, [props.dependencies])
  useEffect(() => internalHooks.subscribe(control), [control, internalHooks, key])

  // 数据注入
  const children = useInjectField(props, instance, control, internalHooks)

  return <Fragment key={resetCount}>{children}</Fragment>
}

export default function WrapperFormField(props: ExternalFormFieldProps) {
  const { name, isListField } = props

  const { listPath = [] } = InternalFormInstanceContext.useState()

  const path = isUndefined(name) ? [] : listPath.concat(toArray(name))

  const key = isListField ? 'keep' : _getName(path)

  return <InternalFormField key={key} {...props} name={path} />
}
