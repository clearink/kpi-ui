import { useConstant, useForceUpdate } from '_shared/hooks'
import { useMemo } from 'react'

import type { ArrowCoords, InternalTooltipProps, PopupCoords } from '../props'

import aligners from '../utils/aligner'

export class TooltipState {
  $popup = {
    current: null as HTMLDivElement | null,
  }

  $trigger = {
    current: null as HTMLElement | null,
  }

  arrowCoords: Partial<ArrowCoords> = {}

  popupCoords: Partial<PopupCoords> = { left: '-1000vw', top: '-1000vh' }

  popups: Element[] = []

  get popup() {
    return this.$popup.current
  }

  get trigger() {
    return this.$trigger.current
  }
}

export class TooltipAction {
  private setArrowCoords = (value: ArrowCoords | null) => {
    if (!value) return

    this.states.arrowCoords = value

    this.forceUpdate()
  }

  private setPopupCoords = (value: PopupCoords | null) => {
    if (!value) return

    this.states.popupCoords = value

    this.forceUpdate()
  }

  updateCoords = (props: InternalTooltipProps) => {
    const { arrowCoords, popup, popupCoords, trigger } = this.states

    if (!popup || !trigger) return

    const getCoords = aligners[props.placement!] || aligners.top

    const [getArrowCoords, getPopupCoords] = getCoords(props, popup, trigger)

    this.setArrowCoords(getArrowCoords(arrowCoords))

    this.setPopupCoords(getPopupCoords(popupCoords))
  }

  constructor(
    private forceUpdate: () => void,
    private states: TooltipState,
  ) {}
}

export default function useTooltipStore() {
  const update = useForceUpdate()

  const states = useConstant(() => new TooltipState())

  const actions = useMemo(() => new TooltipAction(update, states), [update, states])

  return { actions, states }
}
