import CtxHelper from './helper'
import { logger } from '../utils'
import type { FormInstance } from '../../form/props'
import type { InternalFormInstance } from '../../form/internal_props'

// TODO: 目前还不确定
interface FormContextState {
  register: (form: FormInstance, name?: string) => () => void
}

// Form 组件传递数据给 Form.Field
export const FormContext = CtxHelper<FormContextState>({
  register: () => () => {},
})

// 将formControl实例传递给field组件
const notFoundContext: any = () =>
  logger.error(true, 'Can not find FormContext. Please make sure you wrap Field under Form.')
export const FieldContext = CtxHelper<InternalFormInstance>({
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
  scrollToField: notFoundContext,
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
      setFieldMeta: notFoundContext,
      setFormProps: notFoundContext,
      dispatch: notFoundContext,
      registerSubscribe: notFoundContext,
    }
  },
})

export const FieldListContext = CtxHelper<null>(null)
