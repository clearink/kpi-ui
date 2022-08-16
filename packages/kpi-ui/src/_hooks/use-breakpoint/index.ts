import { useEffect, useState } from 'react'
import { INIT_MATCHES, ScreenMatch } from '../../_constant/breakpoint'
import { isUndefined } from '../../_utils'
import useRefCallback from '../use-event'
import MediaObserver from './media_observer'

// 基础响应式断点 hooks
export type ShouldUpdateHandler = (query: ScreenMatch<boolean>) => boolean
export default function useBreakpoint(shouldUpdate?: ShouldUpdateHandler) {
  const [matches, updateMatches] = useState(() => INIT_MATCHES)

  const subscribe = useRefCallback((query: ScreenMatch<boolean>) => {
    if (isUndefined(shouldUpdate) || shouldUpdate(query)) {
      updateMatches(query)
    }
  })

  useEffect(() => {
    const observer = new MediaObserver(subscribe)
    return () => observer.unsubscribe()
  }, [subscribe])

  return matches
}
