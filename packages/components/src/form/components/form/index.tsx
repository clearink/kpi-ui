import { omit, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { DisabledContext, SizeContext } from '_shared/contexts'
import { useEvent, usePrefixCls } from '_shared/hooks'
import { forwardRef, useImperativeHandle, useMemo, type ForwardedRef } from 'react'
import { FormContext, FormContextState } from '../../_shared/context'
import useForm from './hooks/use_form'
import useFormatClass from './hooks/use_format_class'
// comps
import { Form as InternalForm } from '_shared/components'
// types
import type { FormInstance, FormProps } from './props'

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
  layout: 'horizontal',
  requiredMark: true,
  colon: true,
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
    name,
    colon,
    size,
    disabled,
    labelAlign,
    labelWrap,
    labelCol,
    wrapperCol,
    form,
    layout,
    onFailed,
    requiredMark,
    scrollToFirstError,
  } = props

  const prefixCls = usePrefixCls('form')

  const classes = useFormatClass(prefixCls, props)

  const formInstance = useForm(form)

  useImperativeHandle(ref, () => formInstance)

  const formContext = useMemo<FormContextState>(() => {
    return {
      formName: name,
      labelAlign,
      labelWrap,
      labelCol,
      wrapperCol,
      colon,
      requiredMark,
      form: formInstance,
      layout,
    }
  }, [colon, requiredMark, formInstance, labelAlign, labelCol, labelWrap, layout, name, wrapperCol])

  const onFailedWithEffect = useEvent((errors: any) => {
    onFailed?.(errors)
    if (!scrollToFirstError) return
    // formInstance.scrollToField()
  })

  const attrs = omit(props, excluded)

  return (
    <DisabledContext.Provider value={disabled}>
      <SizeContext.Provider value={size}>
        <FormContext.Provider value={formContext}>
          <InternalForm<State>
            {...attrs}
            name={name}
            className={classes}
            form={formInstance}
            onFailed={onFailedWithEffect}
          />
        </FormContext.Provider>
      </SizeContext.Provider>
    </DisabledContext.Provider>
  )
}

export default withDisplayName(forwardRef(Form), 'Form') as <State = any>(
  props: FormProps<State> & React.RefAttributes<FormInstance<State>>
) => JSX.Element
