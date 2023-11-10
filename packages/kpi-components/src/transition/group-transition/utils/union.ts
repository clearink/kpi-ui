import { isNullish } from '@kpi-ui/utils'
import type { ReactElement } from 'react'

// 并集且有序
export default function union(
  map: Map<ReactElement['key'], ReactElement>,
  enters: Set<ReactElement['key']>,
  children: ReactElement[]
) {
  let lastIndex = -1

  const sequences = children
    .map((el) => [el.key, enters.has(el.key) ? el : map.get(el.key)!])
    .filter((item) => !isNullish(item[1])) as [ReactElement['key'], ReactElement][]

  return Array.from(map).reduce((result, [key, el]) => {
    const index = result.findIndex((item) => item[0] === key)

    if (index < 0) result.splice(++lastIndex, 0, [key, el])
    else lastIndex = Math.max(index, lastIndex)

    return result
  }, sequences)
}
