import { useConstant, useDerivedState, useEvent } from '@kpi-ui/hooks'
import { withDefaults, isEqual, isFunction, withoutProperties, toArray } from '@kpi-ui/utils'
import {
  createElement,
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  type FormEvent,
} from 'react'
import { FieldContext, FormContext } from '../../context'
import { HOOK_MARK } from '../control'
import useForm from '../../hooks/use_form'

import type { InternalFormInstance } from '../internal_props'
import type { FormInstance, FormProps } from './props'

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
  const { name, tag, form, fields, children, onReset, initialValues, validateTrigger } = props

  const instance = useForm(form) as InternalFormInstance<State>

  useImperativeHandle(ref, () => instance)

  const internalHook = useMemo(() => instance.getInternalHooks(HOOK_MARK)!, [instance])

  // 用于多表单联动
  const parent = FormContext.useState()

  useEffect(() => parent.register(instance, name), [instance, name, parent])

  internalHook.setFormProps(props, parent)

  // 设置初始值, 仅在挂载前设置一次
  useConstant(() => internalHook.setInitialValues(initialValues))

  // 事件处理
  const handleSubmit = useEvent((e?: FormEvent) => {
    e && e.preventDefault()
    e && e.stopPropagation()

    instance.submitForm()
  })

  const handleReset = useEvent((e: FormEvent) => {
    e && e.preventDefault()
    e && e.stopPropagation()

    instance.resetFields()
    onReset && onReset(e)
  })

  const fieldContext = useMemo(() => {
    return { ...instance, validateTrigger, formName: name }
  }, [instance, validateTrigger, name])

  // 同步 fields 字段
  useDerivedState(fields, {
    compare: (curr, prev) => isEqual(toArray(curr), toArray(prev)),
    listener: () => internalHook.setFields(fields),
  })

  const elements = (
    <FieldContext.Provider value={fieldContext}>
      {isFunction(children) ? children(instance.getFieldsValue(true), instance) : children}
    </FieldContext.Provider>
  )

  if (tag === null) return elements

  // 表单剩余字段
  const formProps = withoutProperties(props, excluded)

  return createElement(
    tag as any,
    { ...formProps, onSubmit: handleSubmit, onReset: handleReset },
    elements
  )
}

export default withDefaults(forwardRef(Form), {
  preserve: true,
  validateTrigger: 'onChange',
  tag: 'form',
} as const)
