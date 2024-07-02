import { omit, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { Form as InternalForm } from '_shared/components'
import { DisabledContext, SizeContext } from '_shared/contexts'
import { useEvent, usePrefixCls } from '_shared/hooks'
import { type ForwardedRef, forwardRef, useImperativeHandle, useMemo } from 'react'

import type { FormContextState } from '../../_shared/context'
import type { FormInstance, FormProps } from './props'

import { FormContext } from '../../_shared/context'
import useForm from './hooks/use_form'
import useFormatClass from './hooks/use_format_class'

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

const defaultProps: Partial<FormProps> = {
  colon: true,
  layout: 'horizontal',
  requiredMark: true,
}

function Form<State = any>(_props: FormProps<State>, ref: ForwardedRef<FormInstance<State>>) {
  const props = withDefaults(_props, {
    ...defaultProps,
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

export default withDisplayName(forwardRef(Form), 'Form') as <State = any>(
  props: FormProps<State> & React.RefAttributes<FormInstance<State>>,
) => JSX.Element
