import { useConstant, useForceUpdate, useWatchValue } from '@kpi-ui/hooks'
import { isNumber } from '@kpi-ui/utils'
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

  frameId = -1

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

  private shouldUpdateCoords = (b: TooltipCoords) => {
    const a = this.states.coords

    const positions = ['top', 'right', 'bottom', 'left'] as const

    return positions.some((direction) => a[direction] !== b[direction])
  }

  private setCoords = (value: TooltipCoords) => {
    if (!this.shouldUpdateCoords(value)) return

    this.states.coords = value

    this.forceUpdate()
  }

  private generateCoords = (props: InternalTooltipProps): TooltipCoords => {
    const { placement } = props

    // 获取 trigger 在文档流中具体的位置
    const triggerRect = this.trigger!.getBoundingClientRect()

    const tooltipRect = this.tooltip!.getBoundingClientRect()

    let top: TooltipCoords['top'] = 'auto'
    let left: TooltipCoords['left'] = 'auto'

    switch (placement) {
      case 'topLeft':
        top = triggerRect.top - tooltipRect.height
        left = triggerRect.left
        break
      case 'top':
        top = triggerRect.top - tooltipRect.height
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
        break
      case 'topRight':
        top = triggerRect.top - tooltipRect.height
        left = triggerRect.left + triggerRect.width - tooltipRect.width
        break
      case 'rightTop':
        top = triggerRect.top
        left = triggerRect.left + triggerRect.width
        break
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
        left = triggerRect.left + triggerRect.width
        break
      case 'rightBottom':
        top = triggerRect.top + triggerRect.height - tooltipRect.height
        left = triggerRect.left + triggerRect.width
        break
      case 'bottomLeft':
        top = triggerRect.top + triggerRect.height
        left = triggerRect.left
        break
      case 'bottom':
        top = triggerRect.top + triggerRect.height
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
        break
      case 'bottomRight':
        top = triggerRect.top + triggerRect.height
        left = triggerRect.left + triggerRect.width - tooltipRect.width
        break
      case 'leftTop':
        top = triggerRect.top
        left = triggerRect.left - tooltipRect.width
        break
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
        left = triggerRect.left - tooltipRect.width
        break
      case 'leftBottom':
        top = triggerRect.top + triggerRect.height - tooltipRect.height
        left = triggerRect.left - tooltipRect.width
        break
      default:
        top = triggerRect.top - tooltipRect.height
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
        break
    }

    return {
      top: isNumber(top) ? Math.floor(top) : top,
      left: isNumber(left) ? Math.floor(left) : left,
      right: 'auto',
      bottom: 'auto',
    }
  }

  // 当初始时open=true,updateCoords会调用2次
  updateCoords = (props: InternalTooltipProps) => {
    if (!this.tooltip || !this.trigger) return null

    const { autoLayout, placement } = props

    // 1. 根据 placement 生成数据
    const newCoords = this.generateCoords(props)

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
