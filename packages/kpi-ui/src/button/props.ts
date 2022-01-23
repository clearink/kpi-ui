import { ButtonHTMLAttributes, ReactChild, ReactNode } from 'react'
// export type LiteralUnion<T extends U, U> = T | (U & {})
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** 按钮类型 */
  type?: 'default' | 'primary' | 'dashed' | 'link' | 'text'
  shape?: 'default' | 'circle' | 'round'
  /** 按钮大小 */
  size?: 'small' | 'middle' | 'large'
  /** 加载中 */
  loading?: boolean | { delay: number }
  /** 禁用 */
  disabled?: boolean
  /** 警告按钮 */
  danger?: boolean
  /** 块级 */
  block?: boolean
  /** 幽灵按钮 */
  ghost?: boolean
  /** 图标 */
  icon?: ReactNode
  htmlType?: 'submit' | 'reset' | 'button'
  children?: ReactChild

  href?: string
  target?: string
}
