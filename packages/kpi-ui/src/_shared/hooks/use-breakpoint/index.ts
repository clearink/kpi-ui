import { isUndefined } from '@kpi-ui/utils'
import { useEffect, useState } from 'react'
import { useEvent } from '../use-event'
import observer from './breakpoint_observer'
// types
import type { ScreenMatch } from './breakpoint'

// 基础响应式断点 hooks
export function useBreakpoint(shouldUpdate?: (query: ScreenMatch<boolean>) => boolean) {
  const [matches, updateMatches] = useState(observer.getCurrentMatches)

  const handler = useEvent((query: ScreenMatch<boolean>) => {
    if (isUndefined(shouldUpdate) || shouldUpdate(query)) {
      updateMatches(query)
    }
  })

  useEffect(() => observer.subscribe(handler), [handler])

  return matches
}
