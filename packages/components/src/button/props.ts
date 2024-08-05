import type { HasChildren, SemanticStyledProps } from '@comps/_shared/types'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

import type { SizeType } from '../config-provider/_shared/props'

/**
 * @desc >支持原生 button 的其他所有属性
 */
export interface ButtonProps
  extends HasChildren,
  SemanticStyledProps<'icon' | 'root' | 'text'>,
  ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * @zh 块级格式
   */
  block?: boolean

  /**
   * @zh 虚线
   * @default false
   */
  dashed?: boolean

  /**
   * @zh 禁用
   */
  disabled?: boolean
  /**
   * @zh 幽灵按钮
   */
  ghost?: boolean

  /**
   * @zh 前缀图标
   */
  icon?: ReactNode

  /**
   * @zh 加载中
   */
  loading?: { delay: number } | boolean

  /**
   * @zh 形状
   * @enum
   * @default default
   */
  shape?: 'circle' | 'default' | 'round'

  /**
   * @zh 按钮大小
   */
  size?: SizeType

  /**
   * @zh  按钮主题
   * @enum
   * @default primary
   */
  theme?: 'danger' | 'info' | 'primary' | 'success' | 'warning'

  /**
   * @zh 变体(在不影响布局属性的情况下所派生出的类型)
   * @enum
   * @default default
   */
  variant?: 'dashed' | 'filled' | 'link' | 'outlined' | 'text'
}
