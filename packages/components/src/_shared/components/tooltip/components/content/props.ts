import type { HasChildren } from '@kpi-ui/types'
import type { ReactElement } from 'react'

export interface TooltipContentProps extends Required<HasChildren<ReactElement>> {
  onMounted: (el: Element | null) => () => void

  onResize: () => void

  onScroll: () => void

  open: boolean
}
