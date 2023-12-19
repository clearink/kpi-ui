import { mergeRefs } from '@kpi-ui/utils'
import { cloneElement, useEffect, useRef } from 'react'
import { addListener } from '../_shared/utils'
import useTouchEffect from './hooks/use_touch_effect'

import type { TouchEffectProps } from './props'

// button checkbox radio 等一些组件中点击动效
export default function TouchEffect(props: TouchEffectProps) {
  const { children, disabled } = props

  const $container = useRef<HTMLElement>(null)

  const showTouchEffect = useTouchEffect($container, props)

  useEffect(() => {
    const container = $container.current

    if (!container || container.nodeType !== 1 || disabled) return

    return addListener(container, 'click', showTouchEffect, true)
  }, [showTouchEffect, disabled])

  const ref = mergeRefs($container, (children as any).ref)

  return cloneElement(children as any, { ref })
}
