import type { HasChildren, SemanticStyledProps } from '@kpi-ui/types'
import type { OverlayProps } from '../overlay/props'

export type ToolTipTrigger = 'hover' | 'focus' | 'click' | 'contextMenu'

export interface InternalTooltipProps
  extends Required<HasChildren<React.ReactElement>>,
    SemanticStyledProps<'root' | 'arrow' | 'main' | 'title' | 'content'>,
    Pick<OverlayProps, 'open' | 'zIndex' | 'transitions'> {
  title?: React.ReactNode
  content?: React.ReactNode

  trigger?: ToolTipTrigger | ToolTipTrigger[]

  // tooltip 关闭时默认不会更新，防止页面闪烁
  fresh?: boolean

  onOpenChange?: (open: boolean) => void
}
