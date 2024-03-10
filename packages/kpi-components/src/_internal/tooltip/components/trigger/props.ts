import type { HasChildren } from '@kpi-ui/types'
import type { DOMAttributes, ReactElement } from 'react'

export interface TooltipTriggerProps extends Required<HasChildren<ReactElement>> {
  open: boolean
  onResize: () => void
  onScroll: () => void
  events: DOMAttributes<HTMLDivElement>
}
