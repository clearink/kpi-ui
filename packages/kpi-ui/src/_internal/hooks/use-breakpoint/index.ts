import { useEffect, useState } from 'react'
import { useEvent, isUndefined } from '@kpi/shared'
import observer from './breakpoint_observer'

import type { ScreenMatch } from '../../constant/breakpoint'

// 基础响应式断点 hooks
export default function useBreakpoint(shouldUpdate?: (query: ScreenMatch<boolean>) => boolean) {
  const [matches, updateMatches] = useState(observer.getCurrentMatches)

  const handler = useEvent((query: ScreenMatch<boolean>) => {
    if (isUndefined(shouldUpdate) || shouldUpdate(query)) {
      updateMatches(query)
    }
  })

  useEffect(() => observer.subscribe(handler), [handler])

  return matches
}
