import type { ReactNode } from 'react'
import type {
  FormInstance as $FormInstance,
  FormProps as $FormProps,
  FormFieldProps as $FormFieldProps,
} from '../_internal/components/form/props'

export interface FormProps<State = any> extends $FormProps<State> {}

export interface FormFieldProps<State = any> extends Omit<$FormFieldProps<State>, 'children'> {
  children?: ReactNode
}

export interface FormInstance<State = any> extends $FormInstance<State> {}
