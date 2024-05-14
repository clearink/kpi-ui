import { makeEventListener, ownerDocument, shallowMerge, toArray } from '@kpi-ui/utils'
import { useCallback, useEffect, type DOMAttributes } from 'react'
import {
  getClickEvents,
  getContextMenuEvents,
  getFocusEvents,
  getHoverEvents,
} from '../utils/events'
// types
import type { InternalTooltipProps } from '../props'
import type { TooltipState } from './use_tooltip_store'

// 触发事件
export default function useTriggerEvent(
  states: TooltipState,
  props: InternalTooltipProps,
  setOpen: (state: boolean, delay?: number) => void
) {
  const { trigger, openDelay, closeDelay } = props

  const actions = new Set(toArray(trigger))

  // 有且仅有 hover 时才不会向 document 挂载 click 事件
  const onlyHover = actions.size === 1 && actions.has('hover')

  useEffect(() => {
    if (onlyHover) return

    const trigger = states.$trigger.current

    return makeEventListener(ownerDocument(trigger), 'mousedown', () => {
      console.log('mouse down')
    })
  }, [onlyHover, states])

  let triggerEvents: DOMAttributes<HTMLDivElement> = {}

  let popupEvents: DOMAttributes<HTMLElement> = {}

  // prettier-ignore
  const onOpen = useCallback(() => { setOpen(true, openDelay) }, [openDelay, setOpen])

  // prettier-ignore
  const onClose = useCallback(() => { setOpen(false, closeDelay) }, [closeDelay, setOpen])

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
