import {
  type FormEvent,
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
  Ref,
  ReactElement,
  useRef,
  useEffect,
} from 'react'
import { isFunction, omit, toArray, useConstructor, useEvent, isEqual } from '@kpi/shared'
import withDefaultProps from '../../hocs'
import { FieldContext, FormContext } from '../../context'
import { HOOK_MARK } from '../control'
import useForm from '../hooks/use_form'

import type { InternalFormInstance } from '../internal_props'
import type { FormInstance, FormProps } from '../props'

const excluded = [
  'name',
  'as',
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
  const { name, as, form, children: $children, onReset, initialValues, validateTrigger } = props

  const formInstance = useForm(form) as InternalFormInstance

  useImperativeHandle(ref, () => formInstance)

  const internalHook = useMemo(() => formInstance.getInternalHooks(HOOK_MARK), [formInstance])

  // 用于多表单联动
  const parent = FormContext.useState()

  useEffect(() => {
    return parent.register(formInstance, name)
  }, [formInstance, name, parent])

  // TODO: 实现表单联动功能
  internalHook?.setFormProps(props, parent)

  // 设置初始值, 仅在挂载前设置一次
  useConstructor(() => internalHook?.setInitialValues(initialValues))

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

  const fieldContext = useMemo(() => {
    return { ...formInstance, validateTrigger, formName: name }
  }, [formInstance, validateTrigger, name])

  // 同步 fields 字段
  const prevFields = useRef<FormProps['fields']>()
  useEffect(() => {
    const prev = toArray(prevFields.current, true)
    const next = toArray(props.fields, true)

    if (!isEqual(prev, next)) internalHook?.setFields(next)

    prevFields.current = next
  }, [internalHook, props.fields])

  const children = (
    <FieldContext.Provider value={fieldContext}>
      {isFunction($children)
        ? $children(formInstance.getFieldsValue(true), formInstance)
        : $children}
    </FieldContext.Provider>
  )

  if (as === null) return children

  const Component: any = as ?? 'form'

  // 表单剩余字段
  const formProps = omit(props, excluded)

  return (
    <Component {...formProps} onSubmit={handleSubmit} onReset={handleReset}>
      {children}
    </Component>
  )
}

export default withDefaultProps(forwardRef(Form), {
  preserve: true,
  validateTrigger: 'onChange',
} as const) as <State = any>(
  props: FormProps<State> & { ref?: Ref<FormInstance<State>> }
) => ReactElement
