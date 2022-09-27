import FormControl from '../form/form_control'
import { FormInstance } from '../form/props'
import ctxHelper from './helper'

// TODO: 目前还不确定
interface FormContextState {
  register: (form: FormInstance, name?: string) => () => void
}

// Form 组件传递数据给 Form.Field
export const FormContext = ctxHelper<FormContextState>({
  register: () => () => {},
})

// 将formControl实例传递给field组件
export const FieldContext = ctxHelper<FormControl | null>(null)
