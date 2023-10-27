import type { Key, ReactElement } from 'react'

export function minus(ids: (Key | null)[], children: ReactElement[]) {
  const keys = children.map((el) => el.key)
  // old 没有 new 有
  const enters = keys.filter((key) => !ids.includes(key))

  // old 有 new 没有
  const exits = ids.filter((id) => !keys.includes(id))

  return [enters, exits] as const
}

// 并集且有序
export function union(ids: (Key | null)[], children: ReactElement[]) {
  let lastIndex = -1

  const keys = children.map((el) => el.key)

  return ids.reduce((result, key) => {
    const index = result.findIndex((item) => item === key)

    if (index < 0) result.splice(++lastIndex, 0, key)
    else lastIndex = Math.max(index, lastIndex)

    return result
  }, keys)
}
