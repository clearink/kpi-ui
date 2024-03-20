// types
import type { HasChildren, SemanticStyledProps } from '@kpi-ui/types'
import type { OverlayProps } from '../_internal/overlay/props'

export type ToolTipTrigger = 'hover' | 'focus' | 'click' | 'contextMenu'

export type TooltipPlacement =
  | 'topLeft'
  | 'top'
  | 'topRight'
  | 'rightTop'
  | 'right'
  | 'rightBottom'
  | 'bottomRight'
  | 'bottom'
  | 'bottomLeft'
  | 'leftBottom'
  | 'left'
  | 'leftTop'

export interface Coords {
  top?: number | string
  right?: number | string
  bottom?: number | string
  left?: number | string
  '--origin-x'?: string
  '--origin-y'?: string
}

export interface TooltipProps
  extends Required<HasChildren<React.ReactElement>>,
    SemanticStyledProps<'root' | 'main' | 'arrow' | 'content'>,
    Pick<OverlayProps, 'zIndex' | 'getContainer' | 'keepMounted' | 'unmountOnExit'> {
  transition?: string

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
