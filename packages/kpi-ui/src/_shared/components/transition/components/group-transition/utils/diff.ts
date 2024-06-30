import { hasItem } from '@kpi-ui/utils'
import type { ReactElement } from 'react'

/**
 * @description 找出本次变更需要进行入场和离场动画的元素
 */
export default function diff(prev: ReactElement[], next: ReactElement[]) {
  const oldKeys = prev.map((el) => el.key)

  const newKeys = next.map((el) => el.key)

  // old 没有 new 有
  const enters = newKeys.filter((key) => !hasItem(oldKeys, key))

  // old 有 new 没有
  const exits = oldKeys.filter((key) => !hasItem(newKeys, key))

  return [new Set(enters), new Set(exits)] as const
}
