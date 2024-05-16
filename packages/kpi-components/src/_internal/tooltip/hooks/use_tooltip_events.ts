import { useDeepMemo } from '@kpi-ui/hooks'
import { batch, getShadowRoot, makeEventListener, ownerWindow, toArray } from '@kpi-ui/utils'
import { useEffect, useMemo } from 'react'
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
  const { trigger } = props

  const actions = useDeepMemo(() => new Set(toArray(trigger)), [trigger])

  const clickToHide = actions.has('click') || actions.has('contextMenu')

  useEffect(() => {
    const element = states.trigger

    if (!element || !clickToHide) return

    const handler = ({ target }: MouseEvent) => {
      setOpen((state) => (!state || isInPopupChain(states, target as Element) ? state : false))
    }

    const shadowRoot = getShadowRoot(element)

    const thisWindow = ownerWindow(element)

    return batch(
      makeEventListener(thisWindow, 'mousedown', handler, true),
      makeEventListener(thisWindow, 'contextmenu', handler, true),
      shadowRoot && makeEventListener(shadowRoot, 'mousedown', handler, true),
      shadowRoot && makeEventListener(shadowRoot, 'contextmenu', handler, true)
    )
  }, [states, clickToHide, setOpen])

  return useMemo(() => formatTriggerEvents(actions, setOpen), [actions, setOpen])
}
