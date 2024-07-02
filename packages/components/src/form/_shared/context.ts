import { ctxHelper, noop } from '@kpi-ui/utils'

import type { ColProps } from '../../col/props'
import type { FormInstance } from '../components/form/props'
import type { FieldMeta, FormLabelAlign, FormLayout, RequiredMark, ValidateStatus } from '../props'

export interface FormContextState {
  colon?: boolean
  form?: FormInstance
  formName?: string
  labelAlign?: FormLabelAlign
  labelCol?: ColProps
  labelWrap?: boolean
  layout?: FormLayout
  requiredMark?: RequiredMark
  wrapperCol?: ColProps
}

export const FormContext = ctxHelper<FormContextState>({
  labelAlign: 'right',
  layout: 'horizontal',
})

export interface FormItemContextState {
  validateStatus?: ValidateStatus
}

export const FormItemContext = ctxHelper<FormItemContextState>({})

// 收集子字段的 errors 与 warnings

// 收集 noStyle 字段的错误到最近的Form.Item组件上
export const NoStyleContext = ctxHelper<(meta: FieldMeta) => void>(noop)
