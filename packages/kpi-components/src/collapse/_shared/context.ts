import { ctxHelper } from '@kpi-ui/utils'
import type React from 'react'

export interface CollapseContextState {
  // 当前展开的面板
  expandedKeys?: React.Key[]
}

export const CollapseContext = ctxHelper<CollapseContextState>({})
