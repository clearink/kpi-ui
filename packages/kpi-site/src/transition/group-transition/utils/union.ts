import type { Key } from 'react'

// 并集且有序
export default function union<T extends Key | null>(a: T[], b: T[]) {
  let lastIndex = -1

  return a.reduce((result, key) => {
    const index = result.findIndex((item) => item === key)

    if (index < 0) result.splice(++lastIndex, 0, key)
    else lastIndex = Math.max(index, lastIndex)

    return result
  }, b.concat())
}
