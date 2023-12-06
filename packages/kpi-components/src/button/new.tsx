import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { SizeType } from '../config-provider/props'

/**
 * @desc >支持原生 button 的其他所有属性
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * @zh 按钮颜色
   * @default 'default'
   */
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'

  /**
   * @zh 变体(在不影响布局属性的情况下所派生出的类型)
   * @default 'outlined'
   */
  variant?: 'filled' | 'outlined' | 'dashed' | 'text'

  /**
   * @zh 形状
   * @default 'default'
   */
  shape?: 'default' | 'circle' | 'round'

  /**
   * @zh 按钮大小
   */
  size?: SizeType

  /**
   * @zh 加载中
   */
  loading?: boolean | { delay: number }

  /**
   * @zh 禁用
   */
  disabled?: boolean

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

  children?: ReactNode
}
