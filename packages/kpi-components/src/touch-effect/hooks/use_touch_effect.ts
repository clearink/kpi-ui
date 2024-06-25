import { useThrottleFrame } from '_hooks'
import { isBoolean, isFunction } from '@kpi-ui/utils'
import { usePrefixCls } from '_hooks'
import { TouchEffectContext } from '../_shared/context'
import showWaveEffect from '../utils/wave'
// types
import type { TouchEffectProps } from '../props'

export default function useTouchEffect(props: TouchEffectProps) {
  const { component, selector } = props

  const { disabled, showEffect } = TouchEffectContext.useState()

  const prefixCls = usePrefixCls('touch-effect')

  return useThrottleFrame((container: HTMLElement, event: MouseEvent) => {
    if (isBoolean(disabled) && disabled) return

    let target: HTMLElement | null = container

    if (isFunction(selector)) target = selector(container)
    else if (selector) target = container.querySelector(selector)

    const info = { event, prefixCls, component, target }

    if (isFunction(disabled) && disabled(info)) return

    showEffect ? showEffect(info) : showWaveEffect(info)
  })
}
