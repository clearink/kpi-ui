import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { SizeType } from '../config-provider/_shared/props'

/**
 * @desc >支持原生 button 的其他所有属性
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * @zh  按钮主题
   * @default 'primary'
   */
  theme?: 'primary' | 'success' | 'warning' | 'danger' | 'info'

  /**
   * @zh 变体(在不影响布局属性的情况下所派生出的类型)
   * @default 'default'
   */
  variant?: 'default' | 'filled' | 'dashed' | 'text' | 'link'

  /**
   * @zh 虚线
   * @default false
   */
  dashed?: boolean
  /**
   * @zh 形状
   * @default 'default'
   */
  shape?: 'default' | 'round' | 'circle'

  /**
   * @zh 按钮大小
   */
  size?: SizeType

  /**
   * @zh 禁用
   */
  disabled?: boolean

  /**
   * @zh 加载中
   */
  loading?: boolean | { delay: number }

  /**
   * @zh 块级格式
   */
  block?: boolean

  /**
   * @zh 幽灵按钮
   */
  ghost?: boolean

  /**
   * @zh 前缀图标
   */
  icon?: ReactNode

  /**
   * @zh 子元素
   */
  children?: ReactNode
}
