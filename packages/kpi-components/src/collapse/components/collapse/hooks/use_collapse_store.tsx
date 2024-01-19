// utils
import { useConstant, useDerivedState } from '@kpi-ui/hooks'
import { toArray } from '@kpi-ui/utils'
import { ExpandedKey } from '../../../props'
// types
import type { CollapseProps } from '../props'

export class CollapseStore {
  keys: ExpandedKey[] = []

  allKeys: ExpandedKey[] = []

  constructor(props: CollapseProps) {
    this.keys = toArray(props.expandedKeys)
  }
}

export default function useCollapseStore(props: CollapseProps) {
  const { accordion } = props
  const store = useConstant(() => new CollapseStore(props))

  // 监听 accordion, 相比 useEffect 可减少一次 render
  useDerivedState(accordion, () => {})

  return store
}
