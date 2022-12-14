import CtxHelper from './helper'

import type { ColProps } from '../../col/props'
import type { FormInstance, FormLabelAlign, RequiredMark, ValidateStatus } from '../../form/props'

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
  status?: ValidateStatus
}
export const FormItemContext = CtxHelper<FormItemContextState>({})

export interface NoStyleContextState {
  change?: () => void
}

export const NoStyleContext = CtxHelper<NoStyleContextState>({})

export interface FormItemInputContextState {
  change?: () => void
}

export const FormItemInputContext = CtxHelper<FormItemInputContextState>({})
