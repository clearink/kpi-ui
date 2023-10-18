import { withDefaults } from '@kpi/internal'
import { CSSProperties, MouseEventHandler, ReactNode } from 'react'
import useClass from './hooks/use_class'

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

function BackTop(props: BackTopProps) {
  const className = useClass(props)

  return <div className={className}>back-top</div>
}

export default withDefaults(BackTop, {
  duration: 200,
  threshold: 400,
} as const)
