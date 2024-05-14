import type { HasChildren } from '@kpi-ui/types'
import type { ReactElement } from 'react'

export interface TooltipContentProps extends Required<HasChildren<ReactElement>> {
  open: boolean

  onResize: () => void

  onScroll: () => void
}
