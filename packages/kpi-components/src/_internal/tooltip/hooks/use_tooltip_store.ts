import { useConstant, useForceUpdate } from '@kpi-ui/hooks'
import { fallback, isArray, isElement, isNullish, ownerDocument, toArray } from '@kpi-ui/utils'
import { useMemo } from 'react'
// types
import type { InternalTooltipProps, TooltipCoords } from '../props'
import type { OverlayRef } from '../../overlay/props'

export class TooltipState {
  $trigger = {
    current: null as Element | null,
  }

  $tooltip = {
    current: null as HTMLDivElement | null,
  }

  $overlay = {
    current: null as OverlayRef | null,
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

  get container() {
    const container = this.states.$overlay.current?.container

    return isNullish(container) ? ownerDocument().body : container
  }

  private shouldUpdateCoords = (b: TooltipCoords) => {
    const a = this.states.coords

    const positions = ['top', 'right', 'bottom', 'left'] as const

    return positions.some((direction) => a[direction] !== b[direction])
  }

  private setCoords = (value: TooltipCoords) => {
    if (!this.shouldUpdateCoords(value)) return

    this.forceUpdate()

    this.states.coords = value
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

    // 应当根据当前的 container 去定位
    // console.log('this.container', this.container)

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
