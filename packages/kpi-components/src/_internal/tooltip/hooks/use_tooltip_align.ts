// utils
import { useResizeObserver, useThrottleCallback } from '@kpi-ui/hooks'
import { useState } from 'react'
// types
import type { TooltipStore } from './use_tooltip_store'
import type { InternalTooltipProps } from '../props'

export default function useTooltipAlign(store: TooltipStore, props: InternalTooltipProps) {
  const { open } = props

  const [rect, setRect] = useState(() => {
    return {
      width: -1,
      height: -1,
      left: -1,
      top: -1,
    }
  })

  useResizeObserver(
    store.trigger,
    useThrottleCallback(100, (el: Element) => {
      if (!open) return
      const rec = el.getBoundingClientRect()
      console.log('resize', el, rec)
      setRect(rec)
    })
  )

  const getToolTipCoords = () => {}

  return [rect, setRect] as const
}
