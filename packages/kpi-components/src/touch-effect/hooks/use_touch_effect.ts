import { useEvent, useUnmountEffect } from '@kpi-ui/hooks'
import { isFunction } from '@kpi-ui/utils'
import { useRef, type RefObject } from 'react'
import { usePrefixCls } from '../../_shared/hooks'
import { TouchEffectContext } from '../_shared/context'
import wave from '../utils/wave'

import type { TouchEffectProps } from '../props'

function useRafCallback<F extends (...args: any[]) => void>(fn: F) {
  const id = useRef<number>(-1)

  const callback = useEvent((...args: any[]) => {
    cancelAnimationFrame(id.current)

    id.current = requestAnimationFrame(() => fn(...args))
  })

  useUnmountEffect(() => cancelAnimationFrame(id.current))

  return callback as F
}

export default function useTouchEffect(
  $container: RefObject<HTMLElement>,
  props: TouchEffectProps
) {
  const { component, selector } = props

  const className = usePrefixCls('touch-effect')

  const { disabled, effect } = TouchEffectContext.useState()

  return useRafCallback((event: MouseEvent) => {
    const root = $container.current!

    let target: HTMLElement | null = null

    if (isFunction(selector)) target = selector(root)
    else if (selector) target = root.querySelector<HTMLElement>(selector)

    const info = { event, className, component, target: target || root }

    if (!isFunction(disabled) && disabled) return
    if (isFunction(disabled) && disabled(info)) return

    effect ? effect(info) : wave(info)
  })
}
