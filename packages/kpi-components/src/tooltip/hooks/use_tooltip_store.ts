import { useConstant, useForceUpdate } from '@kpi-ui/hooks'
import { useMemo } from 'react'
import aligners from '../utils/aligner'
// types
import type { Coords, TooltipProps } from '../props'
import { defaultProps } from '..'

export class TooltipState {
  $trigger = {
    current: null as HTMLElement | null,
  }

  $popup = {
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
    const positions = ['top', 'right', 'bottom', 'left', '--origin-x', '--origin-y'] as const

    const toString = (value: any) => (Number(value) || 0).toFixed(2)

    return positions.some((pos) => toString(a[pos]) !== toString(b[pos]))
  }

  private setPopupCoords = (value: Coords) => {
    if (!this.shouldUpdateCoords(this.states.popupCoords, value)) return

    this.states.popupCoords = value

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

    // 不能直接计算，得先判断 scroll 逻辑

    const { autoLayout, placement } = props

    const getPopupCoords = aligners[placement!] || aligners[defaultProps.placement!]

    const newPopupCoords = getPopupCoords({
      props,
      popup: this.popup,
      trigger: this.trigger,
      onFlip: () => {},
    })

    // const algorithm = TOOLTIP_PLACEMENT[placement!] || TOOLTIP_PLACEMENT[defaultProps.placement!]

    // const relative = getElementCoords(getRelativeElement(this.popup))
    // const popup = getElementCoords(this.popup)
    // const trigger = getElementCoords(this.trigger)
    // // 1. popup position
    // const newPopupCoords = algorithm.getPopupCoords({
    //   relative,
    //   popup,
    //   trigger,
    // })

    // // 2. arrow position
    // const newArrowCoords = algorithm.getArrowCoords({
    //   relative,
    //   popup,
    //   trigger,
    // })

    // if (algorithm.shouldFlipCoords()) {
    //   //
    // }

    // // newTooltipCoords = algorithm.flipPopupCoords(newTooltipCoords)

    // // 2. arrow position
    // // const newArrowCoords = algorithm.getArrowCoords({
    // //   tooltip: tooltipRect,
    // //   trigger: triggerRect,
    // //   arrow: arrowRect,
    // // })

    // 3. 判断是否需要调整方向
    this.setPopupCoords(newPopupCoords)

    // // this.setArrowCoords(newArrowCoords)
  }
}

export default function useTooltipStore() {
  const forceUpdate = useForceUpdate()

  const states = useConstant(() => new TooltipState())

  const actions = useMemo(() => new TooltipAction(forceUpdate, states), [forceUpdate, states])

  return { states, actions }
}
