import { ctxHelper, noop } from '@kpi-ui/utils'

import type { CollapsibleType, ExpandIconPosition } from '../components/collapse/props'
import type { CollapseProps, ExpandedName } from './props'

export interface CollapseContextState {
  accordion?: CollapseProps['accordion']
  collapsible?: CollapsibleType
  disabled?: boolean
  expandIcon?: CollapseProps['expandIcon']
  expandIconPosition?: ExpandIconPosition

  expandedNames: ExpandedName[]
  keepMounted?: boolean
  onItemClick: (key: ExpandedName) => void
  unmountOnExit?: boolean
}

export const CollapseContext = ctxHelper<CollapseContextState>({
  collapsible: 'header',
  expandedNames: [],
  onItemClick: noop,
})
