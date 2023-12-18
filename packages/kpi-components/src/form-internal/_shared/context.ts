import { ctxHelper, logger, noop } from '@kpi-ui/utils'

import type { AnyObject } from '../../types'
import type { ExternalFieldData, ExternalFormInstance, InternalFormInstance } from './props'

export interface InternalFormContextState {
  register: (form: ExternalFormInstance, name?: string) => () => void
  triggerFormChange: (name: string, changedFields: ExternalFieldData[]) => void
  triggerFormFinish: (name: string, values: AnyObject) => void
}

// Form 组件传递数据给 Form.Field
export const InternalFormContext = ctxHelper<InternalFormContextState>({
  register: () => noop,
  triggerFormChange: noop,
  triggerFormFinish: noop,
})

const notFoundContext: any = () => {
  if (process.env.NODE_ENV !== 'production') {
    logger(true, 'Can not find FormContext. Please make sure you wrap Field under Form.')
  }
}

export const InternalFormInstanceContext = ctxHelper<InternalFormInstance>({
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
  getInternalHooks: () => ({
    setPreserve: notFoundContext,
    setInitialValues: notFoundContext,
    registerField: notFoundContext,
    setFields: notFoundContext,
    registerWatch: notFoundContext,
    subscribe: notFoundContext,
    ensureInitialized: notFoundContext,
    getControl: notFoundContext,
    metaUpdate: notFoundContext,
    setInternalFormMisc: notFoundContext,
    dispatch: notFoundContext,
    registerSubscribe: notFoundContext,
  }),
})
