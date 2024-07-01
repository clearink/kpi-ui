import { useConstant, useForceUpdate, useWatchValue } from '_shared/hooks'
import { getClientCoords, reflow } from '@kpi-ui/utils'
import { useMemo } from 'react'

import type { SegmentedType } from '../props'

export class SegmentedState {
  $group = {
    current: null as HTMLDivElement | null,
  }

  get group() {
    return this.$group.current
  }

  thumb: HTMLDivElement | null = null

  history: [SegmentedType | null, SegmentedType | null]

  latest: DOMRect | null = null

  showThumb = false

  inTransition = false

  items = new Map<SegmentedType | null, HTMLElement | null>()

  constructor(active: SegmentedType) {
    this.history = [null, active]
  }
}

export class SegmentedAction {
  constructor(
    private forceUpdate: () => void,
    private states: SegmentedState,
  ) {}

  setItem = (value: SegmentedType, el: HTMLElement | null) => {
    const { items } = this.states

    el ? items.set(value, el) : items.delete(value)
  }

  setThumb = (el: HTMLDivElement | null) => {
    const { thumb } = this.states

    if (!el && thumb) this.states.latest = getClientCoords(thumb)

    this.states.thumb = el
  }

  setHistory = (value: SegmentedType) => {
    const { history } = this.states

    this.states.history = [history[1], value]
  }

  setShowThumb = (value: boolean) => {
    const { showThumb } = this.states

    if (showThumb !== value) this.forceUpdate()

    this.states.showThumb = value
  }

  setInTransition = (value: boolean) => {
    this.states.inTransition = value
  }

  setThumbStyles = (el: HTMLElement, group: HTMLElement, itemCoords: DOMRect) => {
    const groupCoords = getClientCoords(group)

    const delta = itemCoords.left - groupCoords.left

    el.style.setProperty('transform', `translate3d(${delta}px, 0, 0)`)

    el.style.setProperty('width', `${itemCoords.width}px`)
  }

  onThumbEnter = (el: HTMLElement) => {
    const { items, history, group, latest, inTransition } = this.states

    const from = items.get(history[0])

    if (!from || !group) return

    const itemCoords = inTransition && latest ? latest : getClientCoords(from)

    this.setInTransition(true)

    this.setThumbStyles(el, group, itemCoords)

    reflow(el)
  }

  onThumbEntering = (el: HTMLElement) => {
    const { items, history, group } = this.states

    const target = items.get(history[1])

    if (!target || !group) return

    this.setThumbStyles(el, group, getClientCoords(target))
  }

  onThumbEntered = () => {
    this.setShowThumb(false)
    this.setInTransition(false)
  }
}

export default function useSegmentedStore(active: SegmentedType) {
  const update = useForceUpdate()

  const states = useConstant(() => new SegmentedState(active))

  const actions = useMemo(() => new SegmentedAction(update, states), [update, states])

  let returnEarly = false

  useWatchValue(active, () => {
    returnEarly = states.showThumb !== true

    actions.setHistory(active)

    actions.setShowThumb(true)
  })

  return { returnEarly, states, actions }
}
