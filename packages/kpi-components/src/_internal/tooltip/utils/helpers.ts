import { fallback, getShadowRoot, isString, toArray } from '@kpi-ui/utils'
import { TooltipState } from '../hooks/use_tooltip_store'
import { InternalTooltipProps } from '../props'

export function isInPopupChain(states: TooltipState, el: Element) {
  const {
    $trigger: { current: trigger },
    $popup: { current: popup },
    popups,
  } = states

  const isInChain = (item: Element | null) =>
    item && (item === el || item.contains(el) || getShadowRoot(item)?.host === el)

  if (trigger && trigger.contains(el)) return true
  if (trigger === el) return true

  return isInChain(trigger) || isInChain(popup) || popups.some((item) => isInChain(item))
}

export function formatTooltipTrigger(props: InternalTooltipProps) {
  const { trigger, openDelay, closeDelay } = props

  if (isString(trigger)) return [{ type: trigger, openDelay, closeDelay }]

  return toArray(trigger).map((item) => {
    if (isString(item)) return { type: item, openDelay, closeDelay }

    return {
      type: item.type,
      openDelay: item.openDelay ?? openDelay,
      closeDelay: item.closeDelay ?? closeDelay,
    }
  })
}
