import { useRef, Fragment, useReducer, useEffect, useMemo } from 'react'

import { withDefaultProps } from '../../_hocs'
import { FieldContext } from '../../_context'
import { FormFieldControl, HOOK_MARK } from '../control/control'

import useFieldStatus from '../hooks/use_field_status'
import useInjectField from '../hooks/use_inject_field'
import type { FormItemProps } from '../props'
import { useMounted } from '../../_hooks'

function FormItem(props: FormItemProps) {
  const { name, rule, dependencies, shouldUpdate, initialValue, preserve } = props
  // 重置次数
  const [resetCount, updateCount] = useReducer((count) => count + 1, 0)

  // 强制更新视图
  const [, forceUpdate] = useReducer((count) => count + 1, 0)

  // 字段各种状态
  const fieldStatus = useFieldStatus(props, forceUpdate)

  // 父级表单
  const parent = FieldContext.useState()?.getInternalHooks(HOOK_MARK)
  const control = useRef(new FormFieldControl(forceUpdate, useMounted()))

  console.log(parent)

  // 注册子字段 销毁时移除该字段(done)
  useEffect(() => {
    const cancel = parent?.registerField(control.current, name)
    return () => cancel?.(preserve)
  }, [name, parent, preserve])

  // 监听依赖字段, 当依赖字段变更时，会执行 control 自身的校验函数(done)
  useEffect(() => parent?.subscribe(name, dependencies), [dependencies, name, parent])

  // 同步参数校验
  useEffect(() => control.current.setValidator(rule), [rule])

  const isRequired = useMemo(() => {
    // 计算是否为必填
  }, [rule])

  const $children = useInjectField(props, parent)

  return <Fragment key={resetCount}>{$children}</Fragment>
}

export default withDefaultProps(FormItem, {
  valuePropName: 'value',
  trigger: 'onChange',
  required: false,
  shouldUpdate: false,
  validateFirst: false,
} as const)

/**
 * QA
 * - 如果每个Form.Item使用不同的control造成的结果
 * 1. name 变更 如何保留之前的值？ (每次数据变更时都会存到FormGroupControl中)
 * 2. 同名name 如何处理（需要同步二者数据）
 * 3.
 *
 * - 表单共用一个 control
 */
