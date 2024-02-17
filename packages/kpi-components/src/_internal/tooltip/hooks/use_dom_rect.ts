import { useResizeObserver, useThrottleCallback } from '@kpi-ui/hooks'
import { useState } from 'react'

export default function useDomRect(ref: React.RefObject<Element>) {
  const [rect, setRect] = useState(() => {
    return {
      width: -1,
      height: -1,
      left: -1,
      top: -1,
    }
  })

  const onResize = useThrottleCallback(100, (el: Element) => {
    const rec = el.getBoundingClientRect()
    console.log('resize', el, rec)
    setRect(rec)
  })

  useResizeObserver(ref, onResize)

  return [rect, setRect] as const
}
