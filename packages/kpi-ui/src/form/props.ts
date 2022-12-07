import type { FormInstance as InternalFormInstance } from '@components/form/props'

export interface FormProps {}

export interface FormFieldProps {}

export interface FormInstance<State = any> extends InternalFormInstance<State> {}
