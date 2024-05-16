import { batch, getShadowRoot, makeEventListener, ownerWindow, toArray } from '@kpi-ui/utils'
import { useEffect } from 'react'

import { formatTriggerEvents, isInPopupChain } from '../utils/helpers'
// types
import type { InternalTooltipProps } from '../props'
import type useTooltipOpen from './use_tooltip_open'
import type { TooltipState } from './use_tooltip_store'

// 触发事件
export default function useTooltipEvents(
  props: InternalTooltipProps,
  states: TooltipState,
  setOpen: ReturnType<typeof useTooltipOpen>[1]
) {
  const actions = new Set(toArray(props.trigger))

  const clickToHide = actions.has('click') || actions.has('contextMenu')

  useEffect(() => {
    const el = states.trigger

    if (!el || !clickToHide) return

    const handler = ({ target }: MouseEvent) => {
      setOpen((state) => (!state || isInPopupChain(states, target as Element) ? state : false))
    }

    const shadowRoot = getShadowRoot(el)

    return batch(
      makeEventListener(ownerWindow(el), 'mousedown', handler, true),
      makeEventListener(ownerWindow(el), 'contextmenu', handler, true),
      shadowRoot && makeEventListener(shadowRoot, 'mousedown', handler, true),
      shadowRoot && makeEventListener(shadowRoot, 'contextmenu', handler, true)
    )
  }, [states, clickToHide, setOpen])

  return formatTriggerEvents(actions, setOpen)
}
