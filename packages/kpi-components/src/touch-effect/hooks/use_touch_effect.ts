import { useDebounceCallback, useEvent } from '@kpi-ui/hooks'
import { fallback, isFunction } from '@kpi-ui/utils'
import { type RefObject } from 'react'
import { TouchEffectContext } from '../../_shared/context'
import Wave from '../utils/wave'

import type { TouchEffectProps } from '../props'

export default function useTouchEffect(container: RefObject<HTMLElement>, props: TouchEffectProps) {
  const { disabled: _disabled, showEffect: _showEffect } = TouchEffectContext.useState()

  const disabled = fallback(_disabled, props.disabled)

  const showEffect = fallback(_showEffect, (event) => {
    if ((isFunction(disabled) && disabled(event)) || disabled) return

    Wave(container.current)
  })!

  return useDebounceCallback(16.667, useEvent(showEffect))
}
