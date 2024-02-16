import type { HasChildren, SemanticStyledProps } from '@kpi-ui/types'
import type { OverlayProps } from '../overlay/props'

export type PopoverTrigger = 'hover' | 'focus' | 'click' | 'contextMenu'

export interface PopoverProps
  extends Required<HasChildren<React.ReactElement>>,
    SemanticStyledProps<'root' | 'title' | 'content'>,
    Pick<OverlayProps, 'open' | 'zIndex'> {
  title?: React.ReactNode
  content?: React.ReactNode

  trigger?: PopoverTrigger | PopoverTrigger[]

  onOpenChange?: (open: boolean) => void
}

export interface InternalTooltipProps {}
