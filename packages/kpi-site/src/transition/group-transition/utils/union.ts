import type { ReactElement } from 'react'

// 并集且有序
export default function union(a: ReactElement[], b: ReactElement[]) {
  let last = -1

  return a.reduce((result, el) => {
    const index = result.findIndex((e) => e.key === el.key)

    if (index === -1) result.splice(++last, 0, el)
    else last = Math.max(index, last)

    return result
  }, b.concat())
}
