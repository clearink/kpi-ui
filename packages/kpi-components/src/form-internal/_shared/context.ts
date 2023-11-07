import { logger, noop } from '@kpi-ui/utils'
import { ctxHelper } from '../../_internal/utils'

import type { AnyObject } from '../../types'
import type { InternalFormInstance } from './form/internal_props'
import type { FieldData, FormInstance } from './form/props'

// TODO: 目前还不确定
export interface FormContextState {
  register: (form: FormInstance, name?: string) => () => void
  triggerFormChange: (name: string, changedFields: FieldData[]) => void
  triggerFormFinish: (name: string, values: AnyObject) => void
}

// Form 组件传递数据给 Form.Field
export const FormContext = ctxHelper<FormContextState>({
  register: () => noop,
  triggerFormChange: noop,
  triggerFormFinish: noop,
})

// 将formControl实例传递给field组件
const notFoundContext: any = () =>
  logger(true, 'Can not find FormContext. Please make sure you wrap Field under Form.')

export const FieldContext = ctxHelper<InternalFormInstance>({
  getFieldError: notFoundContext,
  getFieldsError: notFoundContext,
  getFieldValue: notFoundContext,
  getFieldsValue: notFoundContext,
  setFieldValue: notFoundContext,
  setFieldsValue: notFoundContext,
  validateFields: notFoundContext,
  validateField: notFoundContext,
  submitForm: notFoundContext,
  resetFields: notFoundContext,
  isFieldTouched: notFoundContext,
  isFieldsTouched: notFoundContext,
  isFieldValidating: notFoundContext,
  isFieldsValidating: notFoundContext,
  getInternalHooks: () => {
    return {
      setPreserve: notFoundContext,
      setInitialValues: notFoundContext,
      registerField: notFoundContext,
      setFields: notFoundContext,
      registerWatch: notFoundContext,
      subscribe: notFoundContext,
      ensureInitialized: notFoundContext,
      getControl: notFoundContext,
      metaUpdate: notFoundContext,
      setFormProps: notFoundContext,
      dispatch: notFoundContext,
      registerSubscribe: notFoundContext,
    }
  },
})
