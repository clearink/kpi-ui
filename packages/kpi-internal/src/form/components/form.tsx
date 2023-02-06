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
import {
  isFunction,
  omit,
  toArray,
  useConstructor,
  useEvent,
  useIsomorphicEffect,
  isEqual,
} from '@kpi/shared'
import withDefaultProps from '../../hocs'
import { FieldContext, FormContext } from '../../context'
import { HOOK_MARK } from '../control'
import useForm from '../hooks/use_form'

import type { InternalFormInstance } from '../internal_props'
import type { FormInstance, FormProps } from '../props'

function Form<State = any>(props: FormProps<State>, ref: ForwardedRef<FormInstance>) {
  const {
    name,
    as,
    form,
    children: $children,
    onReset,
    initialValues,
    validateTrigger,
    ...restProps
  } = props

  // 表单剩余字段
  const formProps = omit(restProps, [
    'preserve',
    'validationSchema',
    'fields',
    'onFinish',
    'onFieldsChange',
    'onValuesChange',
    'onFailed',
  ])

  const formInstance = useForm(form) as InternalFormInstance
  useImperativeHandle(ref, () => formInstance)

  const internalHook = useMemo(() => {
    return formInstance.getInternalHooks(HOOK_MARK)
  }, [formInstance])

  // TODO: 实现表单联动功能
  internalHook?.setFormProps(props)

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

  const Root: any = as === null ? Fragment : as ?? 'form'

  const fieldContext = useMemo(() => {
    return { ...formInstance, validateTrigger, formName: name }
  }, [formInstance, validateTrigger, name])

  const children = isFunction($children)
    ? $children(formInstance.getFieldsValue(true), formInstance)
    : $children

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
    <Root {...formProps} onSubmit={handleSubmit} onReset={handleReset}>
      <FieldContext.Provider value={fieldContext}>{children}</FieldContext.Provider>
    </Root>
  )
}

export default withDefaultProps(forwardRef(Form), {
  preserve: true,
  validateTrigger: 'onChange',
} as const) as <State = any>(
  props: FormProps<State> & { ref?: Ref<FormInstance<State>> }
) => ReactElement
