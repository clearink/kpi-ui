import type { ReactElement } from 'react'

// 差集
export default function minus(a: ReactElement[], b: ReactElement[]) {
  const set = new Set(b.map((el) => el.key))

  return a.filter((el) => !set.has(el.key))
}
