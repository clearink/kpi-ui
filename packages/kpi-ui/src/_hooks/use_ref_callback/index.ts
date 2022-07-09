import { useCallback, useLayoutEffect, useRef } from 'react'

// 使用 ref 获得一个memoized 函数 该函数 引用不会变 但是永远会得到最新的数据
type ArrowFunction = (...args: any[]) => any
export default function useRefCallback<T extends ArrowFunction>(callback: T): T {
  const ref = useRef(callback)
  useLayoutEffect(() => {
    ref.current = callback
  }, [callback])
  return useCallback((...args: any[]) => {
    return ref.current(...args)
  }, []) as T
}
