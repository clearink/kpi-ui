import { useConstant, useForceUpdate, useWatchValue } from '@kpi-ui/hooks'
import { useMemo } from 'react'
import { TOOLTIP_PLACEMENT } from '../constants'
// types
import type { InternalTooltipProps, TooltipCoords } from '../props'

export class TooltipState {
  $trigger = {
    current: null as Element | null,
  }

  $tooltip = {
    current: null as HTMLDivElement | null,
  }

  $arrow = {
    current: null as HTMLDivElement | null,
  }

  tooltipCoords: TooltipCoords = {}

  arrowCoords: TooltipCoords = {}
}

export class TooltipAction {
  constructor(private forceUpdate: () => void, private states: TooltipState) {}

  get trigger() {
    return this.states.$trigger.current
  }

  get tooltip() {
    return this.states.$tooltip.current
  }

  get arrow() {
    return this.states.$arrow.current
  }

  private shouldUpdateCoords = (a: TooltipCoords, b: TooltipCoords) => {
    return a.top !== b.top || a.right !== b.right || a.bottom !== b.bottom || a.left !== b.left
  }

  private setTooltipCoords = (value: TooltipCoords) => {
    if (!this.shouldUpdateCoords(this.states.tooltipCoords, value)) return

    this.states.tooltipCoords = value

    this.forceUpdate()
  }

  private setArrowCoords = (value: TooltipCoords) => {
    if (!this.shouldUpdateCoords(this.states.arrowCoords, value)) return

    this.states.arrowCoords = value

    this.forceUpdate()
  }

  // 当初始时open=true,updateCoords会调用2次
  updateCoords = (props: InternalTooltipProps) => {
    console.log('updateCoords')
    if (!this.tooltip || !this.trigger || !this.arrow) return

    // 不能直接计算，得先判断 scroll 逻辑

    const { autoLayout, placement, arrow } = props

    const algorithm = TOOLTIP_PLACEMENT[placement!] || TOOLTIP_PLACEMENT.top

    const tooltipRect = this.tooltip.getBoundingClientRect()
    const triggerRect = this.trigger.getBoundingClientRect()
    const arrowRect = this.arrow.getBoundingClientRect()

    // 1. tooltip position
    const newTooltipCoords = algorithm.getTooltipCoords({
      tooltip: tooltipRect,
      trigger: triggerRect,
      arrow: arrowRect,
    })

    // 2. arrow position
    // const newArrowCoords = algorithm.getArrowCoords({
    //   tooltip: tooltipRect,
    //   trigger: triggerRect,
    //   arrow: arrowRect,
    // })

    // 3. 判断是否需要调整方向
    this.setTooltipCoords(newTooltipCoords)

    // this.setArrowCoords(newArrowCoords)
  }
}

export default function useTooltipStore(props: InternalTooltipProps) {
  const { placement } = props

  const forceUpdate = useForceUpdate()

  const states = useConstant(() => new TooltipState())

  const actions = useMemo(() => new TooltipAction(forceUpdate, states), [forceUpdate, states])

  // prettier-ignore
  useWatchValue(placement, () => { actions.updateCoords(props) })

  return { states, actions }
}
