import type { Key, ReactElement } from 'react'

// 并集且有序
export default function union(
  map: Map<Key | null, ReactElement>,
  enters: Set<Key | null>,
  children: ReactElement[]
) {
  let lastIndex = -1

  const sequences = children.map((el) => {
    if (enters.has(el.key)) return [el.key, el] as const
    return [el.key, map.get(el.key)!] as const
  })

  return Array.from(map).reduce((result, [key, el]) => {
    const index = result.findIndex((item) => item[0] === key)

    if (index < 0) result.splice(++lastIndex, 0, [key, el])
    else lastIndex = Math.max(index, lastIndex)

    return result
  }, sequences)
}
