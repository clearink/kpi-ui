// 动画需要自动播放，自动停止

import type { MotionValue } from '../motion'

type ResolvedValueTarget = any
type Transition = any

export default function createMotionValueAnimation(
  valueName: string,
  value: MotionValue,
  target: ResolvedValueTarget,
  transition: Transition & { elapsed?: number } = {}
) {
  // 创建动画
  return (onComplete: VoidFunction) => {
    return () => {
      // stop
    }
  }
}
