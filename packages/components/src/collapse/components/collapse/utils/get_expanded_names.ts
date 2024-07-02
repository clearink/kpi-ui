import type { ExpandedName } from '@/collapse/props'

import { toArray } from '@kpi-ui/utils'

export default function getExpandedNames(
  names?: ExpandedName | ExpandedName[],
  accordion?: boolean,
) {
  return accordion ? toArray(names).slice(0, 1) : toArray(names)
}
