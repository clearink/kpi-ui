import { useEffect } from 'react'

// 锁定滚动条
export default function useLockScroll(lock: boolean | undefined, node: HTMLElement | null) {
  console.log(lock, node)

  useEffect(() => {
    if (!lock || !node) return
  }, [lock, node])
}
