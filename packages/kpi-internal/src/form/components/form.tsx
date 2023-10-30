import { isEqual, isFunction, omit, toArray, useConstant, useEvent } from '@kpi/shared'
import {
  createElement,
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  type FormEvent,
} from 'react'
import { FieldContext, FormContext } from '../../context'
import withDefaults from '../../hocs'
import { HOOK_MARK } from '../control'
import useForm from '../hooks/use_form'

import type { InternalFormInstance } from '../internal_props'
import type { FormInstance, FormProps } from '../props'

const excluded = [
  'name',
  'tag',
  'form',
  'children',
  'onReset',
  'initialValues',
  'validateTrigger',
  'preserve',
  'validationSchema',
  'fields',
  'onFinish',
  'onFieldsChange',
  'onValuesChange',
  'onFailed',
] as const

function Form<State = any>(props: FormProps<State>, ref: ForwardedRef<FormInstance>) {
  const { name, tag, form, children: $children, onReset, initialValues, validateTrigger } = props

  const formInstance = useForm(form) as InternalFormInstance

  useImperativeHandle(ref, () => formInstance)

  const internalHook = useMemo(() => formInstance.getInternalHooks(HOOK_MARK)!, [formInstance])

  // 用于多表单联动
  const parent = FormContext.useState()

  useEffect(() => {
    return parent.register(formInstance, name)
  }, [formInstance, name, parent])

  internalHook.setFormProps(props, parent)

  // 设置初始值, 仅在挂载前设置一次
  useConstant(() => internalHook.setInitialValues(initialValues))

  // 事件处理
  const handleSubmit = useEvent((e?: FormEvent) => {
    e && e.preventDefault()
    e && e.stopPropagation()

    formInstance.submitForm()
  })

  const handleReset = useEvent((e: FormEvent) => {
    e && e.preventDefault()
    e && e.stopPropagation()

    formInstance.resetFields()
    onReset && onReset(e)
  })

  const fieldContext = useMemo(() => {
    return { ...formInstance, validateTrigger, formName: name }
  }, [formInstance, validateTrigger, name])

  // 同步 fields 字段
  const prevFields = useRef<FormProps['fields']>()
  useEffect(() => {
    const prev = toArray(prevFields.current, true)
    const next = toArray(props.fields, true)

    if (!isEqual(prev, next)) internalHook.setFields(next)

    prevFields.current = next
  }, [internalHook, props.fields])

  const children = (
    <FieldContext.Provider value={fieldContext}>
      {isFunction($children)
        ? $children(formInstance.getFieldsValue(true), formInstance)
        : $children}
    </FieldContext.Provider>
  )

  if (tag === null) return children

  // 表单剩余字段
  const formProps = omit(props, excluded)

  return createElement(
    tag as any,
    { ...formProps, onSubmit: handleSubmit, onReset: handleReset },
    children
  )
}

export default withDefaults(forwardRef(Form), {
  preserve: true,
  validateTrigger: 'onChange',
  tag: 'form',
} as const)
