import { useResizeObserver, useThrottleCallback } from '@kpi-ui/hooks'
import { useState } from 'react'

export default function useDomRect(triggerRef: React.RefObject<Element>) {
  const [rect, setRect] = useState(() => {
    return {
      width: -1,
      height: -1,
      left: -1,
      top: -1,
    }
  })

  useResizeObserver(
    triggerRef,
    useThrottleCallback(100, (el: Element) => {
      const rec = el.getBoundingClientRect()
      console.log('resize', el, rec)
      setRect(rec)
    })
  )

  return [rect, setRect] as const
}
