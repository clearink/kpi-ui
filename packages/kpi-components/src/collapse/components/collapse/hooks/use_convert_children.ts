// utils
import { isArray } from '@kpi-ui/utils'
import { convertChildrenToNodes, convertItemsToNodes } from '../utils/covert'
// types
import type { CollapseProps } from '../props'
import type { ExpandedKey } from '../../../props'

export default function useConvertChildren<K extends ExpandedKey>(props: CollapseProps<K>) {
  const { items, children } = props

  if (isArray(items)) return convertItemsToNodes(items)

  return convertChildrenToNodes(children)
}
