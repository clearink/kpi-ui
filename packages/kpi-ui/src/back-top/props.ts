import type { CSSProperties, MouseEventHandler, ReactNode } from 'react'

export interface BackTopProps {
  // 动作时长
  duration?: number
  target?: () => HTMLElement | Window | Document
  onClick?: MouseEventHandler<HTMLElement>
  style?: CSSProperties
  className?: string
  children?: ReactNode
  // 滚动阈值
  threshold?: number
}
