import { useComposeRefs } from '@kpi-ui/hooks'
import { withDisplayName } from '@kpi-ui/utils'
import { cloneElement, useEffect, useRef } from 'react'
import { addListener } from '../../_shared/utils'
// comps
import useTouchEffect from './hooks/use_touch_effect'
// types
import type { TouchEffectProps } from './props'

// button checkbox radio 等一些组件中点击动效
function TouchEffect(props: TouchEffectProps) {
  const { children, disabled } = props

  const $container = useRef<HTMLElement>(null)

  const showTouchEffect = useTouchEffect($container, props)

  useEffect(() => {
    const container = $container.current

    if (!container || container.nodeType !== 1 || disabled) return

    return addListener(container, 'click', showTouchEffect, true)
  }, [showTouchEffect, disabled])

  const ref = useComposeRefs($container, (children as any).ref)

  return cloneElement(children as any, { ref })
}

export default withDisplayName(TouchEffect)
