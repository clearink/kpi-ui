import { useEvent } from '@kpi-ui/hooks'
import { fillRef } from '@kpi-ui/utils'
import { cloneElement, useEffect, useRef } from 'react'
import { usePrefixCls } from '../../_shared/hooks'
import { addListener } from '../../_shared/utils'
import useWaveEffect from './hooks/use_wave_effect'

import type { WaveProps } from './props'

export default function Wave(props: WaveProps) {
  const { children, disabled } = props

  const name = usePrefixCls('wave')

  const internal = useRef<HTMLElement>(null)

  const showWave = useWaveEffect(internal)

  const refCallback = useEvent((el: null | HTMLElement) => {
    fillRef(el, internal)
    fillRef(el, (children as any).ref)
  })

  useEffect(() => {
    const container = internal.current

    if (!container || container.nodeType !== 1) return

    const handleClick = (e: MouseEvent) => showWave(e)

    return addListener(container, 'click', handleClick, true)
  }, [showWave])

  return cloneElement(children as any, { ref: refCallback })
}

/**
 * 理论上需要可配置 wave 的表现形式
 */
