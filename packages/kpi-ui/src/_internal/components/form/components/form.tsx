import {
  type FormEvent,
  ForwardedRef,
  forwardRef,
  Fragment,
  useImperativeHandle,
  useMemo,
  Ref,
  ReactElement,
  useRef,
} from 'react'
import isEqual from 'react-fast-compare'
import { FieldContext, FormContext } from '../../../context'
import { withDefaultProps } from '../../../hocs'
import { useConstructor, useEvent, useIsomorphicEffect } from '../../../hooks'
import { isFunction, toArray } from '../../../utils'
import { HOOK_MARK } from '../control'
import useForm from '../hooks/use_form'

import type { InternalFormInstance } from '../internal_props'
import type { FormInstance, FormProps } from '../props'

function Form<State = any>(props: FormProps<State>, ref: ForwardedRef<FormInstance>) {
  const { name, as, form, children: $children, onReset, initialValues, validateTrigger } = props

  const formInstance = useForm(form) as InternalFormInstance // form 实例
  useImperativeHandle(ref, () => formInstance)

  const internalHook = useMemo(() => {
    return formInstance.getInternalHooks(HOOK_MARK)
  }, [formInstance])

  internalHook?.setFormProps(props)
  // 如果form是 render props 不要主动更新视图

  // 设置初始值, 仅在挂载前设置一次
  useConstructor(() => internalHook?.setInitialValues(initialValues))

  // 用于多表单联动
  const parent = FormContext.useState()
  useIsomorphicEffect(() => {
    return parent.register(formInstance, name)
  }, [formInstance, name, parent])

  // 事件处理
  const handleSubmit = useEvent((e?: FormEvent) => {
    isFunction(e?.preventDefault) && e?.preventDefault()
    isFunction(e?.stopPropagation) && e?.stopPropagation()

    formInstance.submitForm()
  })

  const handleReset = useEvent((e: FormEvent) => {
    isFunction(e?.preventDefault) && e?.preventDefault()
    isFunction(e?.stopPropagation) && e?.stopPropagation()

    formInstance.resetFields()
    onReset?.(e)
  })

  const Root = useMemo<any>(() => {
    if (as) return as
    return as === null ? Fragment : 'form'
  }, [as])

  const fieldContext = useMemo(() => {
    return { ...formInstance, validateTrigger, formName: name }
  }, [formInstance, validateTrigger, name])

  const children = useMemo(() => {
    if (!isFunction($children)) return $children
    return $children(formInstance.getFieldsValue(true), formInstance)
  }, [$children, formInstance])

  // 同步 fields 字段
  const prevFields = useRef<FormProps['fields']>()
  useIsomorphicEffect(() => {
    const prev = toArray(prevFields.current, true)
    const next = toArray(props.fields, true)
    if (!isEqual(prev, next)) {
      internalHook?.setFields(next)
    }
    prevFields.current = next
  }, [internalHook, props.fields])

  return (
    <Root onSubmit={handleSubmit} onReset={handleReset}>
      <FieldContext.Provider value={fieldContext}>{children}</FieldContext.Provider>
    </Root>
  )
}

export default withDefaultProps(forwardRef<FormInstance, FormProps>(Form), {
  preserve: true,
  validateTrigger: 'onChange',
} as const) as <State = any>(
  props: FormProps<State> & { ref?: Ref<FormInstance<State>> }
) => ReactElement
