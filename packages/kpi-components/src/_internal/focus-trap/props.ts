// types
import type { SemanticStyledProps } from '@kpi-ui/types'
import type React from 'react'

export interface FocusTrapProps extends SemanticStyledProps<'root'> {
  children: React.ReactElement

  active?: boolean

  /**
   * @zh 获取 tabbable 元素
   */
  getTabbable?: (el: HTMLElement) => HTMLElement[]
}
