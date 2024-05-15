import { makeEventListener, ownerDocument, shallowMerge, toArray } from '@kpi-ui/utils'
import { useEffect, type DOMAttributes } from 'react'
import {
  getClickEvents,
  getContextMenuEvents,
  getFocusEvents,
  getHoverEvents,
} from '../utils/events'
import { isInPopupChain } from '../utils/helpers'
// types
import type { InternalTooltipProps } from '../props'
import type { TooltipState } from './use_tooltip_store'
import { useEvent } from '@kpi-ui/hooks'

// 触发事件
export default function useTooltipEvents(
  states: TooltipState,
  props: InternalTooltipProps,
  setOpen: (state: boolean, delay?: number) => void
) {
  const { trigger, openDelay, closeDelay } = props

  const actions = new Set(toArray(trigger))

  // 有且仅有 hover 时才不会向 document 挂载 click 事件
  const hasClickTrigger = actions.has('click')

  let triggerEvents: DOMAttributes<HTMLDivElement> = {}

  let popupEvents: DOMAttributes<HTMLElement> = {}

  // prettier-ignore
  const onOpen = useEvent(() => { setOpen(true, openDelay) })

  // prettier-ignore
  const onClose = useEvent(() => { setOpen(false, closeDelay) })

  useEffect(() => {
    const triggerElement = states.$trigger.current

    if (!hasClickTrigger || !triggerElement) return

    return makeEventListener(ownerDocument(triggerElement), 'mousedown', (e) => {
      isInPopupChain(states, e.target as Element) ? onOpen() : onClose()
    })
  }, [hasClickTrigger, onClose, onOpen, states, trigger])

  if (actions.has('hover')) {
    const [_triggerEvents, _popupEvents] = getHoverEvents(onOpen, onClose)

    triggerEvents = shallowMerge(triggerEvents, _triggerEvents)

    popupEvents = shallowMerge(popupEvents, _popupEvents)
  }

  if (actions.has('click')) {
    const [_triggerEvents, _popupEvents] = getClickEvents(onOpen, onClose)

    triggerEvents = shallowMerge(triggerEvents, _triggerEvents)

    popupEvents = shallowMerge(popupEvents, _popupEvents)
  }

  if (actions.has('focus')) {
    const [_triggerEvents, _popupEvents] = getFocusEvents(onOpen, onClose)

    triggerEvents = shallowMerge(triggerEvents, _triggerEvents)

    popupEvents = shallowMerge(popupEvents, _popupEvents)
  }

  if (actions.has('contextMenu')) {
    const [_triggerEvents, _popupEvents] = getContextMenuEvents(onOpen, onClose)

    triggerEvents = shallowMerge(triggerEvents, _triggerEvents)

    popupEvents = shallowMerge(popupEvents, _popupEvents)
  }

  return [triggerEvents, popupEvents] as const
}
