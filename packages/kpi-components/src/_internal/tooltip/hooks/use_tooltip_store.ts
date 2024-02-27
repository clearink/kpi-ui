import { useConstant, useForceUpdate } from '@kpi-ui/hooks'
import { fallback, isArray, isElement, toArray } from '@kpi-ui/utils'
import { useMemo } from 'react'
// types
import type { InternalTooltipProps, TooltipCoords } from '../props'

export class TooltipState {
  $trigger = {
    current: null as Element | null,
  }

  $tooltip = {
    current: null as HTMLDivElement | null,
  }

  coords: TooltipCoords = { top: 'auto', right: 'auto', bottom: 'auto', left: 'auto' }
}

export class TooltipAction {
  constructor(private forceUpdate: () => void, private states: TooltipState) {}

  get trigger() {
    return this.states.$trigger.current
  }

  get tooltip() {
    return this.states.$tooltip.current
  }

  private isEqualCoords = (a: TooltipCoords, b: TooltipCoords) => {
    const positions: (keyof TooltipCoords)[] = ['top', 'right', 'bottom', 'left']

    return positions.every((direction) => a[direction] === b[direction])
  }

  private setCoords = (value: TooltipCoords) => {
    if (this.isEqualCoords(this.states.coords, value)) return

    this.forceUpdate()

    this.states.coords = value
  }

  setTriggerNode = (el: Element | null) => {
    if (!isElement(el) || this.trigger !== el) return

    this.states.$trigger.current = el

    this.forceUpdate()
  }

  updateCoords = (props: InternalTooltipProps) => {
    const tooltip = this.tooltip

    const trigger = this.trigger
    console.log('updateCoords', tooltip, trigger)

    if (!tooltip || !trigger) return null

    const { autoLayout, placement } = props

    const tooltipRect = tooltip.getBoundingClientRect()

    const triggerRect = trigger.getBoundingClientRect()

    const newCoords: TooltipCoords = {
      top: triggerRect.top - 10 - tooltipRect.height + window.scrollY,
      right: 'auto',
      bottom: 'auto',
      left: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2 + window.scrollX,
    }

    // console.log(tooltipRect, triggerRect)

    this.setCoords(newCoords)
  }
}

export default function useTooltipStore() {
  const forceUpdate = useForceUpdate()

  const states = useConstant(() => new TooltipState())

  const actions = useMemo(() => new TooltipAction(forceUpdate, states), [forceUpdate, states])

  return { states, actions }
}
