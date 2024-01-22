// utils
import { mergeRefs } from '@kpi-ui/utils'
import { useMemo } from 'react'
// types
import type React from 'react'

type ReactRef<T> = React.Ref<T> | React.MutableRefObject<T>

export default function useComposeRefs<T>(...refs: (ReactRef<T> | undefined)[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => mergeRefs(...refs), refs)
}
