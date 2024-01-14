import { useEffect } from 'react'
import getScrollable from './utils/get_scrollable'

// 锁定滚动条
export default function useLockScroll(lock: boolean | undefined, node: HTMLElement | null) {
  console.log(lock, node)

  useEffect(() => {
    if (!lock || !node) return
    const root = getScrollable(node)
  }, [lock, node])
}
