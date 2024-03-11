import { useConstant, useForceUpdate, useWatchValue } from '@kpi-ui/hooks'
import { isNumber } from '@kpi-ui/utils'
import { useMemo } from 'react'
// types
import type { InternalTooltipProps, TooltipCoords } from '../props'
import { TOOLTIP_PLACEMENT } from '../constants'

export class TooltipState {
  $trigger = {
    current: null as Element | null,
  }

  $tooltip = {
    current: null as HTMLDivElement | null,
  }

  frameId = -1

  coords: TooltipCoords = { top: 'auto', left: 'auto' }
}

export class TooltipAction {
  constructor(private forceUpdate: () => void, private states: TooltipState) {}

  get trigger() {
    return this.states.$trigger.current
  }

  get tooltip() {
    return this.states.$tooltip.current
  }

  private shouldUpdateCoords = (b: TooltipCoords) => {
    const a = this.states.coords

    return ['top', 'left'].some((direction) => a[direction] !== b[direction])
  }

  private setCoords = (value: TooltipCoords) => {
    if (!this.shouldUpdateCoords(value)) return

    this.states.coords = value

    this.forceUpdate()
  }

  // 当初始时open=true,updateCoords会调用2次
  updateCoords = (props: InternalTooltipProps) => {
    if (!this.tooltip || !this.trigger) return null

    const { autoLayout, placement } = props

    // 1. 根据 placement 生成数据
    const triggerRect = this.trigger.getBoundingClientRect()

    const tooltipRect = this.tooltip.getBoundingClientRect()

    const algorithm = TOOLTIP_PLACEMENT[placement!] || TOOLTIP_PLACEMENT.top

    const newCoords = algorithm.getCoords(tooltipRect, triggerRect)

    // 2. 判断是否需要调整方向

    this.setCoords(newCoords)
  }
}

export default function useTooltipStore(props: InternalTooltipProps) {
  const { placement } = props

  const forceUpdate = useForceUpdate()

  const states = useConstant(() => new TooltipState())

  const actions = useMemo(() => new TooltipAction(forceUpdate, states), [forceUpdate, states])

  useWatchValue(placement, () => {
    actions.updateCoords(props)
  })

  return { states, actions }
}
