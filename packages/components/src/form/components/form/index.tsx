import { Form as InternalForm } from '@comps/_shared/components'
import { DisabledContext, SizeContext } from '@comps/_shared/contexts'
import { useEvent, usePrefixCls } from '@comps/_shared/hooks'
import { attachDisplayName, withDefaults } from '@comps/_shared/utils'
import { omit } from '@internal/utils'
import { type ForwardedRef, forwardRef, useImperativeHandle, useMemo } from 'react'

import { FormContext, type FormContextState } from '../../_shared/context'
import useForm from './hooks/use_form'
import useFormatClass from './hooks/use_format_class'
import { type FormInstance, type FormProps, defaultFormProps } from './props'

const excluded = [
  'form',
  'colon',
  'layout',
  'labelAlign',
  'labelWrap',
  'labelCol',
  'wrapperCol',
  'size',
  'disabled',
  'scrollToFirstError',
  'requiredMark',
] as const

function _Form<State = any>(_props: FormProps<State>, ref: ForwardedRef<FormInstance<State>>) {
  const props = withDefaults(_props, {
    ...defaultFormProps,
    disabled: DisabledContext.useState(),
    size: SizeContext.useState(),
    // ...ConfigContext.useState().form,
    // colon
    // requiredMark
  })

  const {
    colon,
    disabled,
    form,
    labelAlign,
    labelCol,
    labelWrap,
    layout,
    name,
    onFailed,
    requiredMark,
    scrollToFirstError,
    size,
    wrapperCol,
  } = props

  const prefixCls = usePrefixCls('form')

  const classes = useFormatClass(prefixCls, props)

  const formInstance = useForm(form)

  useImperativeHandle(ref, () => formInstance)

  const formContext = useMemo<FormContextState>(() => {
    return {
      colon,
      form: formInstance,
      formName: name,
      labelAlign,
      labelCol,
      labelWrap,
      layout,
      requiredMark,
      wrapperCol,
    }
  }, [colon, requiredMark, formInstance, labelAlign, labelCol, labelWrap, layout, name, wrapperCol])

  const onFailedWithEffect = useEvent((errors: any) => {
    onFailed?.(errors)
    console.log(scrollToFirstError)
    // if (!scrollToFirstError) return
    // formInstance.scrollToField()
  })

  const attrs = omit(props, excluded)

  return (
    <DisabledContext.Provider value={disabled}>
      <SizeContext.Provider value={size}>
        <FormContext.Provider value={formContext}>
          <InternalForm<State>
            {...attrs}
            className={classes}
            form={formInstance}
            name={name}
            onFailed={onFailedWithEffect}
          />
        </FormContext.Provider>
      </SizeContext.Provider>
    </DisabledContext.Provider>
  )
}

attachDisplayName(_Form)

const Form = forwardRef(_Form) as <State = any>(
  props: FormProps<State> & React.RefAttributes<FormInstance<State>>,
) => JSX.Element

export default Form
