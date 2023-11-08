import type { ExternalNamePath, ExternalFieldMeta } from '../form-internal/props'

export type NamePath = ExternalNamePath

export type FieldMeta = ExternalFieldMeta

export type FormLabelAlign = 'left' | 'right'

export type ValidateStatus = 'success' | 'warning' | 'error' | 'validating' | ''

export type RequiredMark = boolean | 'optional'

export type FormLayout = 'horizontal' | 'inline' | 'vertical'
