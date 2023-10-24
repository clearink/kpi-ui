import type { ReactElement } from 'react'

// 交集
export default function inter(a: ReactElement[], b: ReactElement[]) {
  const set = new Set(a.map((el) => el.key))

  return b.filter((el) => set.has(el.key))
}
