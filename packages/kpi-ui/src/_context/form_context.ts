import CtxHelper from './helper'
import type { InternalFormInstance, FormInstance } from '../form/props'

// TODO: 目前还不确定
interface FormContextState {
  register: (form: FormInstance, name?: string) => () => void
}

// Form 组件传递数据给 Form.Field
export const FormContext = CtxHelper<FormContextState>({
  register: () => () => {},
})

// 将formControl实例传递给field组件
export const FieldContext = CtxHelper<InternalFormInstance | null>()
