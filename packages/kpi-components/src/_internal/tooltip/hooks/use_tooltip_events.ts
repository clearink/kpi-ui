import { makeEventListener, ownerWindow, shallowMerge } from '@kpi-ui/utils'
import { useEffect, type DOMAttributes } from 'react'
import {
  getClickEvents,
  getContextMenuEvents,
  getFocusEvents,
  getHoverEvents,
} from '../utils/events'
import { formatTriggerOptions, isInPopupChain } from '../utils/helpers'
import type useTooltipOpen from './use_tooltip_open'
// types
import type { InternalTooltipProps, TriggerEventOption } from '../props'
import type { TooltipState } from './use_tooltip_store'
import { useEvent } from '@kpi-ui/hooks'

function useWindowMouseEvent(
  states: TooltipState,
  option: TriggerEventOption | undefined,
  [state, setOpen]: ReturnType<typeof useTooltipOpen>
) {
  const { type, closeDelay } = option || {}

  const listener = useEvent((e: MouseEvent) => {
    if (!state) return

    const inChain = isInPopupChain(states, e.target as Element)

    console.log('inChain', inChain)

    if (!inChain) setOpen(false, closeDelay)
  })

  useEffect(() => {
    const trigger = states.$trigger.current

    if (!trigger || !type) return

    const event = type === 'click' ? 'mousedown' : 'contextmenu'

    return makeEventListener(ownerWindow(trigger), event, listener, true)
  }, [states, type, listener])
}

// 触发事件
export default function useTooltipEvents(
  states: TooltipState,
  props: InternalTooltipProps,
  [state, setOpen]: ReturnType<typeof useTooltipOpen>
) {
  const options = formatTriggerOptions(props)

  let triggerEvents: DOMAttributes<HTMLDivElement> = {}

  let popupEvents: DOMAttributes<HTMLElement> = {}

  useWindowMouseEvent(states, options.get('click'), [state, setOpen])

  // TODO: contextmenu 时 也要添加 mousedown 事件
  useWindowMouseEvent(states, options.get('contextMenu'), [state, setOpen])

  if (options.has('hover')) {
    const tuple = getHoverEvents(options.get('hover')!, [state, setOpen])

    triggerEvents = shallowMerge(triggerEvents, tuple[0])

    popupEvents = shallowMerge(popupEvents, tuple[1])
  }

  if (options.has('click')) {
    const tuple = getClickEvents(options.get('click')!, [state, setOpen])

    triggerEvents = shallowMerge(triggerEvents, tuple[0])

    popupEvents = shallowMerge(popupEvents, tuple[1])
  }

  if (options.has('focus')) {
    const tuple = getFocusEvents(options.get('focus')!, [state, setOpen])

    triggerEvents = shallowMerge(triggerEvents, tuple[0])

    popupEvents = shallowMerge(popupEvents, tuple[1])
  }

  if (options.has('contextMenu')) {
    const tuple = getContextMenuEvents(options.get('contextMenu')!, [state, setOpen])

    triggerEvents = shallowMerge(triggerEvents, tuple[0])

    popupEvents = shallowMerge(popupEvents, tuple[1])
  }

  return [triggerEvents, popupEvents] as const
}
