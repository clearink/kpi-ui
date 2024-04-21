import { isNullish, mergeRefs } from '@kpi-ui/utils'
import { useMemo } from 'react'
// types
import type { MayBe, ReactRef } from '@kpi-ui/types'

export default function useComposeRefs<T>(...refs: MayBe<ReactRef<T>>[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => (refs.every(isNullish) ? null : mergeRefs(...refs)), refs)
}
