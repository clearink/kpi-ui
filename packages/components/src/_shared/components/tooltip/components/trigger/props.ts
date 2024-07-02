import type { HasChildren } from '@kpi-ui/types'
import type { DOMAttributes, ReactElement } from 'react'

export interface TooltipTriggerProps extends Required<HasChildren<ReactElement>> {
  events: DOMAttributes<HTMLDivElement>

  onResize: () => void

  onScroll: () => void

  open: boolean
}
