import { useConstant, useForceUpdate } from '_shared/hooks'
import { useMemo } from 'react'
import aligners from '../utils/aligner'
// types
import type { ArrowCoords, InternalTooltipProps, PopupCoords } from '../props'

export class TooltipState {
  $trigger = {
    current: null as HTMLElement | null,
  }

  $popup = {
    current: null as HTMLDivElement | null,
  }

  popups: Element[] = []

  popupCoords: Partial<PopupCoords> = { left: '-1000vw', top: '-1000vh' }

  arrowCoords: Partial<ArrowCoords> = {}

  get trigger() {
    return this.$trigger.current
  }

  get popup() {
    return this.$popup.current
  }
}

export class TooltipAction {
  constructor(private forceUpdate: () => void, private states: TooltipState) {}

  private setPopupCoords = (value: PopupCoords | null) => {
    if (!value) return

    this.states.popupCoords = value

    this.forceUpdate()
  }

  private setArrowCoords = (value: ArrowCoords | null) => {
    if (!value) return

    this.states.arrowCoords = value

    this.forceUpdate()
  }

  updateCoords = (props: InternalTooltipProps) => {
    const { popup, trigger, arrowCoords, popupCoords } = this.states

    if (!popup || !trigger) return

    const getCoords = aligners[props.placement!] || aligners.top

    const [getArrowCoords, getPopupCoords] = getCoords(props, popup, trigger)

    this.setArrowCoords(getArrowCoords(arrowCoords))

    this.setPopupCoords(getPopupCoords(popupCoords))
  }
}

export default function useTooltipStore() {
  const update = useForceUpdate()

  const states = useConstant(() => new TooltipState())

  const actions = useMemo(() => new TooltipAction(update, states), [update, states])

  return { states, actions }
}
