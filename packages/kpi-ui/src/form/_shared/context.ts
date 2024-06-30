import { ctxHelper, noop } from '@kpi-ui/utils'

import type { ColProps } from '../../col/props'
import type { FieldMeta, FormLabelAlign, FormLayout, RequiredMark, ValidateStatus } from '../props'
import type { FormInstance } from '../components/form/props'

export interface FormContextState {
  layout?: FormLayout
  formName?: string
  colon?: boolean
  labelAlign?: FormLabelAlign
  labelWrap?: boolean
  labelCol?: ColProps
  wrapperCol?: ColProps
  requiredMark?: RequiredMark
  form?: FormInstance
}

export const FormContext = ctxHelper<FormContextState>({
  layout: 'horizontal',
  labelAlign: 'right',
})

export interface FormItemContextState {
  validateStatus?: ValidateStatus
}

export const FormItemContext = ctxHelper<FormItemContextState>({})

// 收集子字段的 errors 与 warnings

// 收集 noStyle 字段的错误到最近的Form.Item组件上
export const NoStyleContext = ctxHelper<(meta: FieldMeta) => void>(noop)
