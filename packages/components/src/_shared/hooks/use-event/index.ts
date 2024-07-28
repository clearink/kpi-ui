import type { AnyFn } from '@internal/types'

import { useCallback, useMemo, useRef } from 'react'

// 使用 ref 获得一个memoized 函数 该函数 引用不会变 但是永远会得到最新的数据
export function useEvent<T extends AnyFn>(callback: T): T {
  const ref = useRef(callback)

  // 兼容 react devtool
  useMemo(() => { ref.current = callback }, [callback])

  return useCallback((...args: any[]) => (0, ref.current)(...args), []) as unknown as T
}
