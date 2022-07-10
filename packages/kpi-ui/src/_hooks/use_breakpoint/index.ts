import { useEffect, useMemo, useState } from 'react'
import { Breakpoint, BREAKPOINT_NAME, INIT_MATCHES, ScreenMatch } from '../../_shard/constant'
import MediaObserver from './media_observer'

// 断点
// TODO: 是否应该只返回最大的某一个值呢?
export default function useBreakpoint<M extends boolean>(matchBest: M) {
  const [matches, updateMatches] = useState(() => INIT_MATCHES)
  useEffect(() => {
    const observer = new MediaObserver(updateMatches)
    return () => observer.unsubscribe()
  }, [])
  return useMemo(() => {
    if (!matchBest) return matches
    return BREAKPOINT_NAME.find((point) => !!matches[point])!
  }, [matches, matchBest]) as M extends true ? Breakpoint | undefined : ScreenMatch
}
