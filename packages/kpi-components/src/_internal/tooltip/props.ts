import type { HasChildren, SemanticStyledProps } from '@kpi-ui/types'
import type { OverlayProps } from '../overlay/props'

export type ToolTipTrigger = 'hover' | 'focus' | 'click' | 'contextMenu'

export interface InternalTooltipProps
  extends Required<HasChildren<React.ReactElement>>,
    SemanticStyledProps<'root' | 'arrow' | 'main' | 'title' | 'content'>,
    Pick<OverlayProps, 'zIndex' | 'transitions' | 'getContainer'> {
  title?: React.ReactNode

  content?: React.ReactNode

  trigger?: ToolTipTrigger | ToolTipTrigger[]

  fresh?: boolean

  onOpenChange?: (open: boolean) => void

  open?: boolean

  defaultOpen?: boolean

  openDelay?: number

  closeDelay?: number
}
