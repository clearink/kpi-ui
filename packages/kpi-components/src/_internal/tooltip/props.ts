import { TOOLTIP_PLACEMENT } from './constants'
// types
import type { HasChildren, SemanticStyledProps } from '@kpi-ui/types'
import type { OverlayProps } from '../overlay/props'

export type ToolTipTrigger = 'hover' | 'focus' | 'click' | 'contextMenu'

export type TooltipPlacement = (typeof TOOLTIP_PLACEMENT)[number]

export type TooltipCoords = {
  top: number | 'auto'
  right: number | 'auto'
  bottom: number | 'auto'
  left: number | 'auto'
}

export interface InternalTooltipProps
  extends Required<HasChildren<React.ReactElement>>,
    SemanticStyledProps<'root' | 'arrow' | 'main' | 'title' | 'content'>,
    Pick<OverlayProps, 'zIndex' | 'transitions' | 'getContainer'> {
  content?: React.ReactNode

  trigger?: ToolTipTrigger | ToolTipTrigger[]

  fresh?: boolean

  open?: boolean

  defaultOpen?: boolean

  onOpenChange?: (open: boolean) => void

  openDelay?: number

  closeDelay?: number

  placement?: TooltipPlacement

  autoLayout?: boolean | { pointAtCenter: boolean }

  offset?: number | [number, number]
}
