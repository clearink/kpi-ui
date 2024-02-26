import { useCallback, useEffect, useRef } from 'react'

// 使用 ref 获得一个memoized 函数 该函数 引用不会变 但是永远会得到最新的数据
export default function useEvent<T extends (...args: any[]) => any>(callback: T): T {
  const ref = useRef(callback)

  // prettier-ignore
  useEffect(() => { ref.current = callback }, [callback])

  return useCallback((...args: any[]) => ref.current(...args), []) as unknown as T
}
