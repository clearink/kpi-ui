import { getShadowRoot, shallowMerge } from '@kpi-ui/utils'
import { type DOMAttributes } from 'react'

import type useTooltipOpen from '../hooks/use_tooltip_open'
import type { TooltipState } from '../hooks/use_tooltip_store'
import type { TriggerEvent } from '../props'

import { getClickEvents, getContextMenuEvents, getFocusEvents, getHoverEvents } from './events'

export function isInPopupChain(states: TooltipState, event: MouseEvent) {
  const { popup, popups, trigger } = states

  const el = event.target as Element

  const isInChain = (item: Element | null) =>
    item && (item === el || item.contains(el) || getShadowRoot(item)?.host === el)

  return isInChain(trigger) || isInChain(popup) || popups.some(item => isInChain(item))
}

export function formatTriggerEvents(
  actions: Set<TriggerEvent>,
  setOpen: ReturnType<typeof useTooltipOpen>[1],
) {
  const events: [DOMAttributes<HTMLElement>, DOMAttributes<HTMLElement>][] = []

  if (actions.has('hover')) events.push(getHoverEvents(setOpen))

  if (actions.has('click')) events.push(getClickEvents(setOpen))

  if (actions.has('focus')) events.push(getFocusEvents(setOpen))

  if (actions.has('contextMenu')) events.push(getContextMenuEvents(setOpen))

  // prettier-ignore
  return events.reduce((result, tuple) => {
    result[0] = shallowMerge(result[0], tuple[0])
    result[1] = shallowMerge(result[1], tuple[1])
    return result
  }, [{}, {}])
}
