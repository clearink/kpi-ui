import { useEvent } from '@kpi-ui/hooks'
import { mergeRefs } from '@kpi-ui/utils'
import { cloneElement, useEffect, useRef } from 'react'
import { usePrefixCls } from '../_shared/hooks'
import { addListener } from '../_shared/utils'

import type { TouchEffectProps } from './props'
import useTouchEffect from './hooks/use_touch_effect'

// button checkbox radio 等一些组件中点击动效
export default function TouchEffect(props: TouchEffectProps) {
  const { children, disabled } = props

  const internal = useRef<HTMLElement>(null)

  const showWave = useTouchEffect(internal, props)

  useEffect(() => {
    const container = internal.current

    if (!container || container.nodeType !== 1) return

    return addListener(container, 'click', showWave, true)
  }, [showWave])

  const ref = mergeRefs(internal, (children as any).ref)

  return cloneElement(children as any, { ref })
}
