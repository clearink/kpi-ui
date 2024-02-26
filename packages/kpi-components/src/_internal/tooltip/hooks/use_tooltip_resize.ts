import { useResizeObserver, useThrottleCallback } from '@kpi-ui/hooks'
import { ownerWindow, pushItem } from '@kpi-ui/utils'
import { useEffect } from 'react'
import { addListener } from '../../transition/_shared/utils'
import getScrollElements from '../utils/scrollable'
import useTooltipStore from './use_tooltip_store'
// types
import type { InternalTooltipProps } from '../props'

export default function useTooltipResize(
  states: ReturnType<typeof useTooltipStore>['states'],
  actions: ReturnType<typeof useTooltipStore>['actions'],
  open: boolean,
  props: InternalTooltipProps
) {
  const onChange = useThrottleCallback(100, () => {
    open && actions.updateCoords(props)
  })

  // trigger resize + window resize
  useResizeObserver(states.$trigger, onChange)

  useEffect(() => {
    const tooltip = states.$tooltip.current

    const trigger = states.$trigger.current

    if (!open || !tooltip || !trigger) return

    // TODO: getScrollElements 完善
    const elements = pushItem(getScrollElements(trigger), ownerWindow(trigger) as any)

    const removes = elements.map((el) => addListener(el, 'scroll', onChange))

    return () => removes.forEach((fn) => fn())
  }, [open, states, onChange])
}
