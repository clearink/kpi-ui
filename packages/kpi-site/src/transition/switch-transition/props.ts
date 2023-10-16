import type { ReactNode } from 'react'

export type SwitchMode = 'out-in' | 'in-out' | 'default'
export interface SwitchTransitionProps {
  mode?: SwitchMode
  /**
   * @description 注意，必须显示为子元素设置一个 key 属性帮助 SwitchTransition 识别是否需要进行转场动画
   */
  children?: ReactNode
}
