import { useRef } from 'react'

const initial = Symbol.for('kpi-hook-use-constant-symbol')

export default function useConstant<T>(init: () => T): T {
  // 避免 init函数 返回 null 造成多次错误
  const ref = useRef<typeof initial | T>(initial)

  if (ref.current === initial) ref.current = init()

  return ref.current
}
