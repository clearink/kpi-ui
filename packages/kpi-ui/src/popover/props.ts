import type { SemanticStyledProps } from '@kpi-ui/types'
import type { ReactNode } from 'react'
import type { TooltipProps } from '../tooltip/_shared/props'

export interface PopoverProps
  extends Omit<TooltipProps, 'classNames' | 'styles'>,
    SemanticStyledProps<'root' | 'arrow' | 'title' | 'content'> {
  title?: ReactNode
  content?: ReactNode
}
