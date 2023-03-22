import { useConstant, useUnmountEffect } from '@kpi/shared'
import { createAnimateWithScope } from '../animation/animate'

import type { AnimationScope } from '../animation/animate'

export default function useAnimate<T extends Element = any>() {
  const scope = useConstant<AnimationScope<T>>(() => ({
    current: null!,
    animations: [],
  }))

  const animate = useConstant(() => createAnimateWithScope(scope))

  useUnmountEffect(() => {
    scope.animations.forEach((animation) => animation.stop())
  })

  return [scope, animate] as const
}
