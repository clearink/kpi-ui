// utils
import { ctxHelper, noop } from '@kpi-ui/utils'
// types
import type { CollapsibleType, ExpandIconPosition } from '../components/collapse/props'
import type { CollapseProps, ExpandedName } from './props'

export interface CollapseContextState {
  accordion?: CollapseProps['accordion']
  expandedNames: ExpandedName[]
  expandIconPosition?: ExpandIconPosition
  collapsible?: CollapsibleType
  onItemClick: (key: ExpandedName) => void

  keepMounted?: boolean
  unmountOnExit?: boolean
  expandIcon?: CollapseProps['expandIcon']
}

export const CollapseContext = ctxHelper<CollapseContextState>({
  expandedNames: [],
  onItemClick: noop,
  collapsible: 'header',
})
