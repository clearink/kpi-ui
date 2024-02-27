import { useEvent, useResizeObserver } from '@kpi-ui/hooks'
import { ownerWindow, pushItem } from '@kpi-ui/utils'
import { useEffect } from 'react'
import { addListener } from '../../transition/_shared/utils'
import getScrollable from '../utils/scrollable'
import useTooltipStore from './use_tooltip_store'
// types
import type { InternalTooltipProps } from '../props'

export default function useTooltipResize(
  states: ReturnType<typeof useTooltipStore>['states'],
  actions: ReturnType<typeof useTooltipStore>['actions'],
  open: boolean,
  props: InternalTooltipProps
) {
  // prettier-ignore
  const onChange = useEvent(() => { open && actions.updateCoords(props) })

  // trigger resize + window resize
  useResizeObserver(states.$trigger, onChange)

  useEffect(() => {
    const tooltip = actions.tooltip

    const trigger = actions.trigger

    if (!open || !tooltip || !trigger) return

    const elements = new Set<Element>(pushItem(getScrollable(trigger), ownerWindow(trigger) as any))

    const removes: (() => void)[] = []

    elements.forEach((el) => {
      removes.push(addListener(el, 'scroll', onChange, { passive: true }))
    })

    // prettier-ignore
    return () => removes.forEach((fn) => { fn() })
  }, [open, actions.tooltip, actions.trigger, onChange])
}
