import { isString } from '@kpi/shared'
import type { ReactNode } from 'react'
import type { FieldMeta } from '@kpi/internal/esm/form/internal_props'

import type { ValidateStatus } from '../props'

export function makeErrorEntity(
  error: string | ReactNode,
  status: ValidateStatus | undefined,
  type: 'help' | 'error' | 'warning',
  index = 0
) {
  return {
    key: isString(error) ? error : `${type}__${index}`,
    error,
    status,
  }
}

export function makeEmptyMeta(): FieldMeta {
  return {
    name: [],
    dirty: false,
    touched: false,
    validating: false,
    errors: [],
    warnings: [],
  }
}
