import { useConstant, useForceUpdate } from '@kpi-ui/hooks'
import { useMemo } from 'react'
import aligners from '../utils/aligner'
// types
import type { Coords, ElementCoords, TooltipProps } from '../props'

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

  popupCoords: Coords = { left: '-1000vw', top: '-1000vh' }

  arrowCoords: Coords = {}
}

export class TooltipAction {
  constructor(private forceUpdate: () => void, private states: TooltipState) {}

  get trigger() {
    return this.states.$trigger.current
  }

  get popup() {
    return this.states.$popup.current
  }

  private shouldUpdateCoords = (a: Coords, b: Coords) => {
    const positions = ['top', 'left', 'transform', '--origin-x', '--origin-y'] as const

    const toString = (value: any) => parseFloat(value).toFixed(2)

    return positions.some((pos) => toString(a[pos]) !== toString(b[pos]))
  }

  private setPopupCoords = (value: Coords & { original: ElementCoords }) => {
    const { original, ...newCoords } = value

    const shouldUpdate = this.shouldUpdateCoords(this.states.popupCoords, newCoords)

    const forceUpdate = this.shouldUpdateCoords(newCoords, original)

    if (!shouldUpdate && !forceUpdate) return

    this.states.popupCoords = newCoords

    this.forceUpdate()
  }

  private setArrowCoords = (value: Coords) => {
    if (!this.shouldUpdateCoords(this.states.arrowCoords, value)) return

    this.states.arrowCoords = value

    this.forceUpdate()
  }

  // 当初始时open=true,updateCoords会调用2次
  updateCoords = (props: TooltipProps) => {
    if (!this.popup || !this.trigger) return

    const getCoords = aligners[props.placement!] || aligners.top

    const { popupCoords, arrowCoords } = getCoords({
      props,
      popup: this.popup,
      trigger: this.trigger,
    })

    this.setPopupCoords(popupCoords)

    this.setArrowCoords(arrowCoords)
  }
}

export default function useTooltipStore() {
  const forceUpdate = useForceUpdate()

  const states = useConstant(() => new TooltipState())

  const actions = useMemo(() => new TooltipAction(forceUpdate, states), [forceUpdate, states])

  return { states, actions }
}
