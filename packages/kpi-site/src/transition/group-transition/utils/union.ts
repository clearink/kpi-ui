import type { ReactElement } from 'react'

// 并集且有序
export default function union(a: ReactElement[], b: ReactElement[]) {
  let lastIndex = -1

  return a.reduce((result, el) => {
    const index = result.findIndex((e) => e.key === el.key)

    if (index < 0) result.splice(++lastIndex, 0, el)
    else lastIndex = Math.max(index, lastIndex)

    return result
  }, b.concat())
}
