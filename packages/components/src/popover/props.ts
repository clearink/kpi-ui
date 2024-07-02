import type { SemanticStyledProps } from '@kpi-ui/types'
import type { ReactNode } from 'react'

import type { TooltipProps } from '../tooltip/_shared/props'

export interface PopoverProps
  extends Omit<TooltipProps, 'classNames' | 'styles'>,
  SemanticStyledProps<'arrow' | 'content' | 'root' | 'title'> {
  content?: ReactNode
  title?: ReactNode
}
