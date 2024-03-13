import { TOOLTIP_PLACEMENT } from './constants'
// types
import type { HasChildren, SemanticStyledProps } from '@kpi-ui/types'
import type { OverlayProps } from '../overlay/props'

export type ToolTipTrigger = 'hover' | 'focus' | 'click' | 'contextMenu'

export type TooltipPlacement = keyof typeof TOOLTIP_PLACEMENT

export type TooltipCoords = {
  top?: number | string
  right?: number | string
  bottom?: number | string
  left?: number | string
  '--origin-x'?: string
  '--origin-y'?: string
}

export interface InternalTooltipProps
  extends Required<HasChildren<React.ReactElement>>,
    SemanticStyledProps<'root' | 'arrow' | 'content'>,
    Pick<
      OverlayProps,
      'zIndex' | 'transitions' | 'getContainer' | 'keepMounted' | 'unmountOnExit'
    > {
  content?: React.ReactNode

  trigger?: ToolTipTrigger | ToolTipTrigger[]

  fresh?: boolean

  open?: boolean

  defaultOpen?: boolean

  onOpenChange?: (open: boolean) => void

  openDelay?: number

  closeDelay?: number

  placement?: TooltipPlacement

  arrow?: boolean | { pointAtCenter: boolean }

  autoLayout?: boolean

  offset?: number | [number, number]
}
