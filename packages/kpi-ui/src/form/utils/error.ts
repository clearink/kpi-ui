import type { ReactNode } from 'react'
import { isString } from '../../_internal/utils'

import type { ValidateStatus } from '../props'

export default function makeErrorEntity(
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
