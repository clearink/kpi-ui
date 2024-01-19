// utils
import { ctxHelper, noop } from '@kpi-ui/utils'
// types
import type { CollapseProps, ExpandedKey } from './props'

export interface CollapseContextState {
  accordion?: CollapseProps['accordion']
  expandedKeys: ExpandedKey[]
  arrowPlacement?: CollapseProps['arrowPlacement']
  onItemExpand: (key: ExpandedKey) => void

  keepMounted?: boolean
  unmountOnExit?: boolean
}

export const CollapseContext = ctxHelper<CollapseContextState>({
  expandedKeys: [],
  onItemExpand: noop,
})
