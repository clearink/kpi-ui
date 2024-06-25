import { fallback, isString, pushItem } from '@kpi-ui/utils'
import { useDebounceValue } from '_shared/hooks'
import { useMemo, type ReactNode } from 'react'
// types
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
    status: fallback(status, type),
  }))
}

export default function useFormatExplains(props: FormErrorListProps) {
  const { help, helpStatus } = props

  const errors = useDebounceValue(40, props.errors || [])

  const warnings = useDebounceValue(40, props.warnings || [])

  return useMemo(() => {
    if (help) return makeExplains('help', [help], helpStatus)

    return pushItem(makeExplains('error', errors), makeExplains('warning', warnings))
  }, [errors, help, helpStatus, warnings])
}
