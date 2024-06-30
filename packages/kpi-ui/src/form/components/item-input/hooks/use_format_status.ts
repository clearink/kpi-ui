import { isNullish } from '@kpi-ui/utils'
import { useMemo } from 'react'
// types
import type { FieldMeta, ValidateStatus } from '../../../props'

export default function useFormatStatus(meta: FieldMeta, validateStatus?: ValidateStatus) {
  return useMemo<ValidateStatus>(() => {
    const status: ValidateStatus = ''

    if (!isNullish(validateStatus)) return validateStatus

    if (meta.validating) return 'validating'

    if (meta.errors.length) return 'error'

    if (meta.warnings.length) return 'warning'

    if (meta.touched) return 'success'

    return status
  }, [meta, validateStatus])
}
