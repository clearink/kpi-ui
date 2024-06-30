import { toArray } from '@kpi-ui/utils'
import { ExpandedName } from '@/collapse/props'

export default function getExpandedNames(
  names?: ExpandedName | ExpandedName[],
  accordion?: boolean
) {
  return accordion ? toArray(names).slice(0, 1) : toArray(names)
}
