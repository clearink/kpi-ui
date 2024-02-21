// utils
import { useResizeObserver, useThrottleCallback } from '@kpi-ui/hooks'
import { useState, type RefObject } from 'react'
// types

export default function useTooltipAlign($trigger: RefObject<Element>, open: boolean) {
  const [coords, setCoords] = useState(() => {
    return {
      width: -1,
      height: -1,
      left: -1,
      top: -1,
    }
  })

  useResizeObserver(
    $trigger,
    useThrottleCallback(100, (el: Element) => {
      if (!open) return
      const rec = el.getBoundingClientRect()
      console.log('resize', el, rec)
      setCoords(rec)
    })
  )

  const getToolTipCoords = () => {}

  return [coords, setCoords] as const
}
