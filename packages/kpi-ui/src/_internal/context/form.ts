import CtxHelper from './helper'

import type { ColProps } from '../../col/props'
import type { FormInstance, FormLabelAlign, RequiredMark, ValidateStatus } from '../../form/props'
import { FieldMeta } from '../components/form/internal_props'

export interface FormContextState {
  vertical: boolean
  formName?: string
  colon?: boolean
  labelAlign?: FormLabelAlign
  labelWrap?: boolean
  labelCol?: ColProps
  wrapperCol?: ColProps
  requiredMark?: RequiredMark
  form?: FormInstance
}

export const FormContext = CtxHelper<FormContextState>({
  vertical: false,
  labelAlign: 'right',
})

export interface FormItemContextState {
  validateStatus?: ValidateStatus
}
export const FormItemContext = CtxHelper<FormItemContextState>({})

// 收集子字段的 errors 与 warnings

// 收集 noStyle 字段的错误到最近的Form.Item组件上
export const NoStyleContext = CtxHelper<null>(null)
