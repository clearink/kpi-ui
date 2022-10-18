import { useRef, Fragment, useReducer, useEffect, useMemo } from 'react'

import { withDefaultProps } from '../../_hocs'
import { FieldContext } from '../../_context'
import { FormFieldControl, HOOK_MARK } from '../control/control'

import useFieldStatus from '../hooks/use_field_status'
import useInjectField from '../hooks/use_inject_field'
import { useMounted } from '../../_hooks'
import { isRequiredSchema } from '../../_utils/form_schema/schema'
import { isUndefined, toArray } from '../../_utils'
import type { FormFieldProps } from '../props'
import type { InternalFormFieldProps } from '../internal_props'

function InternalFormField(props: InternalFormFieldProps) {
  const { name, rule, dependencies, required, shouldUpdate, initialValue, preserve } = props
  // 重置次数
  const [resetCount, updateCount] = useReducer((count) => count + 1, 0)

  // 强制更新视图
  const [, forceUpdate] = useReducer((count) => count + 1, 0)

  // 字段各种状态
  const fieldStatus = useFieldStatus(props, forceUpdate)

  // 父级表单
  const context = FieldContext.useState()
  const internalHook = useMemo(() => context.getInternalHooks(HOOK_MARK), [context])
  // TODO：是否还要注册某些回调？
  const control = useRef(new FormFieldControl(forceUpdate, useMounted()))

  // 同步参数校验
  useEffect(() => control.current.setValidator(rule), [rule])

  // console.log('internalHook', internalHook)
  console.log('internalHook', internalHook)

  // 简单判断下是否为必填项
  const isRequired = useMemo(() => required ?? isRequiredSchema(rule), [required, rule])

  // 注册子字段 销毁时移除该字段(done)
  useEffect(() => {
    const cancel = internalHook?.registerField(control.current, name)
    return () => cancel?.(preserve)
  }, [name, internalHook, preserve])

  // 监听依赖字段, 当依赖字段变更时，会执行 control 自身的校验函数(done)
  useEffect(() => {
    const unsubscribe = internalHook?.subscribe(name, dependencies)
    return unsubscribe
  }, [dependencies, name, internalHook])

  const $children = useInjectField(props, context, control.current, internalHook)

  return <Fragment key={resetCount}>{$children}</Fragment>
}

function WrapperFormField(props: FormFieldProps) {
  const { name, ...rest } = props
  // 用于 Form.List 组件
  const { parentNamePath = [] } = FieldContext.useState()

  // 预处理一下 name 字段
  const [namePath, key] = useMemo(() => {
    const path = isUndefined(name) ? [] : [...parentNamePath, ...toArray(name)]
    return [path, `_${(path || []).join('_$_')}`] as const
  }, [name, parentNamePath])

  const $props = { key, name: namePath, ...rest }

  // 由于这里根据 name 设置了 key
  // name 改变会重新渲染一个新的组件， 不需要在 InternalFormField 监听 name 了
  return <InternalFormField {...$props} />
}

export default withDefaultProps(WrapperFormField, {
  valuePropName: 'value',
  trigger: 'onChange',
  shouldUpdate: false,
  validateFirst: false,
} as const)
