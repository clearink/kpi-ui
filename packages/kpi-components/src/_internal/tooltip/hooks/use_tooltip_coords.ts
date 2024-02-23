import { useResizeObserver, useThrottleCallback } from '@kpi-ui/hooks'
import { ownerWindow, pushItem } from '@kpi-ui/utils'
import { useEffect, useState } from 'react'
import { addListener } from '../../transition/_shared/utils'
import getScrollElements from '../utils/scrollable'
// types
import type { InternalTooltipProps, TooltipCoords } from '../props'
import type { TooltipStore } from './use_tooltip_store'

export function makeInitCoords(): TooltipCoords {
  return { top: 'auto', right: 'auto', bottom: 'auto', left: 'auto' }
}

export default function useTooltipCoords(
  store: TooltipStore,
  props: InternalTooltipProps,
  open: boolean
) {
  const [coords, setCoords] = useState(makeInitCoords)

  const onChange = useThrottleCallback(100, () => {
    const newCoords = store.updateCoords(open, props, coords)

    newCoords && setCoords(newCoords)
  })

  // trigger resize + window resize
  useResizeObserver(store.$trigger, onChange)

  useEffect(() => {
    const tooltip = store.$tooltip.current

    const trigger = store.$trigger.current

    if (!open || !tooltip || !trigger) return

    // TODO: getScrollElements 完善
    const elements = pushItem(getScrollElements(trigger), ownerWindow(trigger) as any)

    const removes = elements.map((el) => addListener(el, 'scroll', onChange))

    return () => removes.forEach((fn) => fn())
  }, [open, store, onChange])

  return [coords, setCoords] as const
}
