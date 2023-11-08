import type { ReactNode } from 'react'
import type {
  InternalFormListProps,
  InternalListField,
  FormListHelpers,
  InternalFieldMeta,
} from '../../../form-internal/props'

export interface FormListProps extends Omit<InternalFormListProps, 'children'> {
  children: (
    fields: InternalListField[],
    helpers: FormListHelpers,
    meta: Pick<InternalFieldMeta, 'errors' | 'warnings'>
  ) => ReactNode
}
