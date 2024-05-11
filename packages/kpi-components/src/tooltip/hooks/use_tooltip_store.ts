import { useConstant, useForceUpdate } from '@kpi-ui/hooks'
import { useMemo } from 'react'
import aligners from '../utils/aligner'
// types
import type { ArrowCoords, PopupCoords, TooltipProps } from '../props'

export class TooltipState {
  $trigger = {
    current: null as HTMLElement | null,
  }

  $popup = {
    current: null as HTMLDivElement | null,
  }

  $content = {
    current: null as HTMLDivElement | null,
  }

  popupCoords: Partial<PopupCoords> = { left: '-1000vw', top: '-1000vh' }

  arrowCoords: Partial<ArrowCoords> = {}
}

export class TooltipAction {
  constructor(private forceUpdate: () => void, private states: TooltipState) {}

  get trigger() {
    return this.states.$trigger.current
  }

  get popup() {
    return this.states.$popup.current
  }

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

  // 当初始时open=true,updateCoords会调用2次
  updateCoords = (props: TooltipProps) => {
    if (!this.popup || !this.trigger) return

    const { arrowCoords, popupCoords } = this.states

    const getCoords = aligners[props.placement!] || aligners.top

    const [getArrowCoords, getPopupCoords] = getCoords(props, this.popup, this.trigger)

    this.setArrowCoords(getArrowCoords(arrowCoords))

    this.setPopupCoords(getPopupCoords(popupCoords))
  }
}

export default function useTooltipStore() {
  const forceUpdate = useForceUpdate()

  const states = useConstant(() => new TooltipState())

  const actions = useMemo(() => new TooltipAction(forceUpdate, states), [forceUpdate, states])

  return { states, actions }
}
