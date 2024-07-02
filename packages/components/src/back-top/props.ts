import type { CSSProperties, MouseEventHandler, ReactNode } from 'react'

export interface BackTopProps {
  children?: ReactNode
  className?: string
  // 动作时长
  duration?: number
  onClick?: MouseEventHandler<HTMLElement>
  style?: CSSProperties
  target?: () => Document | HTMLElement | Window
  // 滚动阈值
  threshold?: number
}
