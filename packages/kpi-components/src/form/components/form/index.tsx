import { useEvent } from '@kpi-ui/hooks'
import { shallowMergeWithFallback, withDefaults, withoutProperties } from '@kpi-ui/utils'
import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  type ForwardedRef,
  type ReactElement,
  type Ref,
} from 'react'
import { ConfigContext, DisabledContext, SizeContext } from '../../../_shared/context'
import { usePrefixCls } from '../../../_shared/hooks'
import InternalForm from '../../../form-internal'
import { FormContext, FormContextState } from '../../_shared/context'
import useForm from './hooks/use_form'
import useFormatClass from './hooks/use_format_class'

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

function Form<State = any>(props: FormProps<State>, ref: ForwardedRef<FormInstance<State>>) {
  const {
    name,
    labelAlign,
    labelWrap,
    labelCol,
    wrapperCol,
    form,
    layout,
    onFailed,
    scrollToFirstError,
  } = props

  const fallbacks = shallowMergeWithFallback(
    props,
    {
      size: SizeContext.useState(),
      disabled: DisabledContext.useState(),
      ...ConfigContext.useState().form,
    },
    ['size', 'disabled', 'colon', 'requiredMark']
  )

  const prefixCls = usePrefixCls('form')

  const classes = useFormatClass(prefixCls, props, fallbacks)

  const formInstance = useForm(form)

  useImperativeHandle(ref, () => formInstance)

  const formContext = useMemo<FormContextState>(() => {
    return {
      formName: name,
      labelAlign,
      labelWrap,
      labelCol,
      wrapperCol,
      colon: fallbacks.colon,
      requiredMark: fallbacks.requiredMark,
      form: formInstance,
      layout,
    }
  }, [
    fallbacks.colon,
    fallbacks.requiredMark,
    formInstance,
    labelAlign,
    labelCol,
    labelWrap,
    layout,
    name,
    wrapperCol,
  ])

  const onFailedWithEffect = useEvent((errors: any) => {
    onFailed && onFailed(errors)
    if (!scrollToFirstError) return
    // formInstance.scrollToField()
  })

  const attrs = withoutProperties(props, excluded)

  return (
    <DisabledContext.Provider value={fallbacks.disabled}>
      <SizeContext.Provider value={fallbacks.size}>
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

export default withDefaults(forwardRef(Form), {
  layout: 'horizontal',
  requiredMark: true,
  colon: true,
} as const) as <State = any>(
  props: FormProps<State> & { ref?: Ref<FormInstance<State>> }
) => ReactElement
