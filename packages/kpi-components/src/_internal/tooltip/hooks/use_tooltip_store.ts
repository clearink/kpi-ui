import { useConstant } from '@kpi-ui/hooks'
// types
import type { InternalTooltipProps, TooltipCoords } from '../props'

export class TooltipStore {
  $trigger = {
    current: null as Element | null,
  }

  $tooltip = {
    current: null as HTMLDivElement | null,
  }

  updateCoords = (open: boolean, props: InternalTooltipProps, oldCoords: TooltipCoords) => {
    const tooltip = this.$tooltip.current

    const trigger = this.$trigger.current

    if (!open || !tooltip || !trigger) return null

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

    if (newCoords === oldCoords) return null

    tooltip.style.setProperty(
      'insert',
      `${newCoords.top} ${newCoords.right} ${newCoords.bottom} ${newCoords.left}`
    )

    console.log(tooltipRect, triggerRect)

    return newCoords
  }
}

export default function useTooltipStore() {
  return useConstant(() => new TooltipStore())
}
