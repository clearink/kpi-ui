import { useConstant, useUnmountEffect } from '@kpi/shared'
import { createAnimateWithScope } from '../animation/animate'
import each from '../utils/each'

import type { AnimationScope } from '../animation/interface'

export default function useAnimate<T extends Element = any>() {
  const scope = useConstant<AnimationScope<T>>(() => ({
    current: null!,
    animations: [],
  }))

  const animate = useConstant(() => createAnimateWithScope(scope))

  useUnmountEffect(() => each(scope.animations, (animation) => animation.stop()))

  return [scope, animate] as const
}
