import { useConstant, useDerivedState } from '@kpi-ui/hooks'
import {
  isEqual,
  isFunction,
  isNullish,
  toArray,
  withDefaults,
  withoutProperties,
} from '@kpi-ui/utils'
import {
  ForwardedRef,
  createElement,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  type FormEvent,
  type Ref,
} from 'react'
import { InternalFormContext, InternalFormInstanceContext } from '../../_shared/context'
import { HOOK_MARK } from './control'
import useForm from './hooks/use_form'

import type { InternalFormInstance } from './control/props'
import type { InternalFormProps } from './props'

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

function InternalForm<State = any>(
  props: InternalFormProps<State>,
  ref: ForwardedRef<InternalFormInstance<State>>
) {
  const { name, tag, form, fields, children, onReset, initialValues, validateTrigger } = props

  const instance = useForm(form) as InternalFormInstance<State>

  // 用于多表单联动
  const parentForm = InternalFormContext.useState()

  useImperativeHandle(ref, () => instance)

  const internalHook = useMemo(() => instance.getInternalHooks(HOOK_MARK)!, [instance])

  internalHook.setInternalFormMisc(props, parentForm)

  // 设置初始值, 仅在挂载前设置一次
  useConstant(() => internalHook.setInitialValues(initialValues))

  useEffect(() => parentForm.register(instance, name), [instance, name, parentForm])

  // 同步 fields 字段
  useDerivedState(fields, {
    compare: isEqual,
    listener: () => internalHook.setFields(toArray(fields)),
  })

  const handleSubmit = (e?: FormEvent) => {
    e && e.preventDefault()
    e && e.stopPropagation()

    instance.submitForm()
  }

  const handleReset = (e: FormEvent) => {
    e && e.preventDefault()
    e && e.stopPropagation()

    instance.resetFields()

    onReset && onReset(e)
  }

  const instanceContext = useMemo(() => {
    return { ...instance, validateTrigger, formName: name }
  }, [instance, validateTrigger, name])

  const elements = (
    <InternalFormInstanceContext.Provider value={instanceContext}>
      {isFunction(children) ? children(instance.getFieldsValue(true), instance) : children}
    </InternalFormInstanceContext.Provider>
  )

  if (isNullish(tag)) return elements

  // 表单剩余字段
  const attrs = {
    ...withoutProperties(props, excluded),
    onSubmit: handleSubmit,
    onReset: handleReset,
  }

  return createElement(tag as any, attrs, elements)
}

export default withDefaults(forwardRef(InternalForm), {
  preserve: true,
  validateTrigger: 'onChange',
  tag: 'form',
}) as <State = any>(
  props: InternalFormProps<State> & { ref?: Ref<InternalFormInstance<State>> }
) => JSX.Element
