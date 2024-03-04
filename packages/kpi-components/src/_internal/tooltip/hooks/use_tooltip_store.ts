import { useConstant, useForceUpdate } from '@kpi-ui/hooks'
import { fallback, isArray, isElement, isNullish, ownerDocument, toArray } from '@kpi-ui/utils'
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

  setTriggerNode = (el: Element | null) => {
    if (!isElement(el) || this.trigger !== el) return

    this.states.$trigger.current = el

    this.forceUpdate()
  }

  // 当初始时open=true,updateCoords会调用2次
  updateCoords = (props: InternalTooltipProps) => {
    const tooltip = this.tooltip

    const trigger = this.trigger

    if (!tooltip || !trigger) return null

    const { autoLayout, placement } = props

    // 获取 trigger 在文档流中具体的位置
    const triggerRect = trigger.getBoundingClientRect()

    const tooltipRect = tooltip.getBoundingClientRect()

    // 根据 placement 与 autoLayout 属性去生成 newCoords

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
