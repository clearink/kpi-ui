import { useThrottleFrame } from '@kpi-ui/hooks'
import { isBoolean, isFunction } from '@kpi-ui/utils'
import { usePrefixCls } from '../../../_shared/hooks'
import { TouchEffectContext } from '../_shared/context'
import wave from '../utils/wave'
// types
import type { RefObject } from 'react'
import type { TouchEffectProps } from '../props'

export default function useTouchEffect(
  $container: RefObject<HTMLElement>,
  props: TouchEffectProps
) {
  const { component, selector } = props

  const className = usePrefixCls('touch-effect')

  const { disabled, effect } = TouchEffectContext.useState()

  return useThrottleFrame((event: MouseEvent) => {
    if (isBoolean(disabled) && disabled) return

    const root = $container.current!

    let target: HTMLElement | null = null

    if (isFunction(selector)) target = selector(root)
    else if (selector) target = root.querySelector(selector)

    const info = { event, className, component, target: target || root }

    if (isFunction(disabled) && disabled(info)) return

    effect ? effect(info) : wave(info)
  })
}
