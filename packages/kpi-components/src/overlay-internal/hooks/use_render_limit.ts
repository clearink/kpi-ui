import { useEffect, useState } from 'react'

// 是否应该渲染 overlay
export default function useRenderLimit(limit: number) {
  const [count, setCount] = useState(1)

  useEffect(() => {
    if (count < limit) setCount((p) => p + 1)
  }, [count, limit])

  return count >= limit
}
