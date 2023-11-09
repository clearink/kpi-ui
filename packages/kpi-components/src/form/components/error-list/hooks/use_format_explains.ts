import { useDebounceValue } from '@kpi-ui/hooks'
import { isString, pushItem } from '@kpi-ui/utils'
import { ReactNode, useMemo } from 'react'

import type { ValidateStatus } from '../../../props'
import type { FormErrorListProps } from '../props'

const makeExplains = (
  type: 'help' | 'error' | 'warning',
  items: ReactNode[],
  status?: ValidateStatus
) => {
  return items.map((item, index) => ({
    key: isString(item) ? item : `${type}_${index}`,
    value: item,
    status,
  }))
}

export default function useFormatExplains(props: FormErrorListProps) {
  const { help, helpStatus } = props

  const errors = useDebounceValue(20, props.errors || [])

  const warnings = useDebounceValue(20, props.warnings || [])

  return useMemo(() => {
    if (help) return makeExplains('help', [help], helpStatus)

    return pushItem(
      makeExplains('error', errors, 'error'),
      makeExplains('warning', warnings, 'warning')
    )
  }, [errors, help, helpStatus, warnings])
}
