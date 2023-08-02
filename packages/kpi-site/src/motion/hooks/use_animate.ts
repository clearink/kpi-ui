import { useConstant, useUnmountEffect } from '@kpi/shared'
import { createAnimateWithScope } from '../animation/animate'

import type { AnimationScope } from '../animation/interface'

export default function useAnimate<T extends Element = any>() {
  const scope = useConstant<AnimationScope<T>>(() => ({
    current: null!,
    controllers: [],
  }))

  const animate = useConstant(() => createAnimateWithScope(scope))

  useUnmountEffect(() => scope.controllers.forEach((animation) => animation.cancel()))

  return [scope, animate] as const
}
