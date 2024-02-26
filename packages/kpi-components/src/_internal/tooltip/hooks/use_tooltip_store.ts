import { useConstant, useForceUpdate } from '@kpi-ui/hooks'
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

  private isEqualCoords = (a: TooltipCoords, b: TooltipCoords) => {
    const positions: (keyof TooltipCoords)[] = ['top', 'right', 'bottom', 'left']

    return positions.every((direction) => a[direction] === b[direction])
  }

  private setCoords = (value: TooltipCoords) => {
    if (this.isEqualCoords(this.states.coords, value)) return

    this.forceUpdate()

    this.states.coords = value
  }

  updateCoords = (props: InternalTooltipProps) => {
    const tooltip = this.states.$tooltip.current

    const trigger = this.states.$trigger.current

    if (!tooltip || !trigger) return null

    const { autoLayout, placement } = props

    const tooltipRect = tooltip.getBoundingClientRect()

    const triggerRect = trigger.getBoundingClientRect()

    const offsetY = 10

    const newCoords: TooltipCoords = {
      top: triggerRect.top - offsetY - tooltipRect.height,
      right: 'auto',
      bottom: 'auto',
      left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
    }

    console.log(tooltipRect, triggerRect)

    this.setCoords(newCoords)
  }
}

export default function useTooltipStore() {
  const forceUpdate = useForceUpdate()

  const states = useConstant(() => new TooltipState())

  const actions = useMemo(() => new TooltipAction(forceUpdate, states), [forceUpdate, states])

  return { states, actions }
}
