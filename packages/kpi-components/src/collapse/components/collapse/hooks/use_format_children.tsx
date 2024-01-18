// utils
import { isArray } from '@kpi-ui/utils'
import { useMemo } from 'react'
// comps
import CollapseItem from '../../item'
// types
import type { CollapseProps } from '../props'
import type { ExpandedKey } from '../../../props'

export default function useFormatChildren<K extends ExpandedKey>(props: CollapseProps) {
  const { items, children } = props

  return useMemo(() => {
    if (!isArray(items)) return children
    return items.map((item) => <CollapseItem {...item} key={item.name} />)
  }, [items, children])
}
