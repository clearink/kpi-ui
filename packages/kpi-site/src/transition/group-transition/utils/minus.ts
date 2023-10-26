import type { Key } from 'react'

// 差集
export default function minus<T extends Key | null>(a: T[], b: T[]) {
  const set = new Set(b)

  return a.filter((key) => !set.has(key))
}
