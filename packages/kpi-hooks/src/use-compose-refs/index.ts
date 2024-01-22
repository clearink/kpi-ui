// utils
import { isNullish, mergeRefs } from '@kpi-ui/utils'
import { useMemo } from 'react'
// types
import type { MayBe } from '@kpi-ui/types'
import type { Ref } from 'react'

export default function useComposeRefs<T>(...refs: MayBe<Ref<T>>[]) {
  return useMemo(() => {
    return refs.every(isNullish) ? null : mergeRefs(...refs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs)
}
