import {
  type ReactElement,
  type Ref,
  type ForwardedRef,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from 'react'
import InternalForm from '../../../_internal/components/form'
import { DisabledContext, FormContext, SizeContext } from '../../../_internal/context'
import { ConfigContext } from '../../../_internal/context/config'
import { withDefaultProps } from '../../../_internal/hocs'
import { useFormClass } from '../../hooks/use_class'
import useForm from '../../hooks/use_form'

import type { FormInstance, FormProps } from '../../props'
import type { FormContextState } from '../../../_internal/context'

function Form(props: FormProps, ref: ForwardedRef<FormInstance>) {
  const { form: contextFormConfig } = ConfigContext.useState()
  const contextDisabled = DisabledContext.useState()
  const contextSize = SizeContext.useState()

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
    size = contextSize,
    disabled = contextDisabled,
    colon = contextFormConfig?.colon,
    requiredMark = contextFormConfig?.requiredMark,
    ...restFormProps
  } = props

  const className = useFormClass(props, size, requiredMark)

  const formInstance = useForm(form)

  useImperativeHandle(ref, () => formInstance)

  const formContext = useMemo<FormContextState>(() => {
    return {
      formName: name,
      labelAlign,
      labelWrap,
      wrapperCol,
      colon,
      requiredMark,
      form: formInstance,
      vertical: layout === 'vertical',
    }
  }, [name, labelAlign, labelWrap, wrapperCol, colon, requiredMark, formInstance, layout])

  const onFailedWithEffect = useCallback(
    (errors: any) => {
      onFailed?.(errors)
      if (scrollToFirstError) {
        // formInstance.scrollToField()
      }
    },
    [onFailed, scrollToFirstError]
  )

  return (
    <DisabledContext.Provider value={disabled}>
      <SizeContext.Provider value={size}>
        <FormContext.Provider value={formContext}>
          <InternalForm
            {...restFormProps}
            name={name}
            className={className}
            form={formInstance}
            onFailed={onFailedWithEffect}
          />
        </FormContext.Provider>
      </SizeContext.Provider>
    </DisabledContext.Provider>
  )
}

export default withDefaultProps(forwardRef(Form), {
  layout: 'horizontal',
  requiredMark: true,
} as const) as <State = any>(
  props: FormProps<State> & { ref?: Ref<FormInstance<State>> }
) => ReactElement
