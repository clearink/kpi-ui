// 基础的 CssTransition 组件
export interface TransitionProps {
  // 动效条件
  when: boolean
  // 持续时间(毫秒)
  duration?: number
}

export default function Transition(props: TransitionProps) {
  const { when } = props
}
