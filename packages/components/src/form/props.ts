// 内部使用
import type { ExternalFieldMeta, ExternalNamePath } from '_shared/components'

export type NamePath = ExternalNamePath

export type FieldMeta = ExternalFieldMeta

export type FormLabelAlign = 'left' | 'right'

export type ValidateStatus = '' | 'error' | 'success' | 'validating' | 'warning'

export type RequiredMark = 'optional' | boolean

export type FormLayout = 'horizontal' | 'inline' | 'vertical'
