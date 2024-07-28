import { useConstant, useForceUpdate, useWatchValue } from '@comps/_shared/hooks'
import { getClientCoords, reflow } from '@internal/utils'
import { useMemo } from 'react'

import type { SegmentedType } from '../props'

export class SegmentedState {
  $group = {
    current: null as HTMLDivElement | null,
  }

  history: [SegmentedType | null, SegmentedType | null]

  inTransition = false

  items = new Map<SegmentedType | null, HTMLElement | null>()

  latest: DOMRect | null = null

  showThumb = false

  thumb: HTMLDivElement | null = null

  constructor(active: SegmentedType) {
    this.history = [null, active]
  }

  get group() {
    return this.$group.current
  }
}

export class SegmentedAction {
  handleThumbEnter = (el: HTMLElement) => {
    const { group, history, inTransition, items, latest } = this.states

    const from = items.get(history[0])

    if (!from || !group) return

    const itemCoords = inTransition && latest ? latest : getClientCoords(from)

    this.setInTransition(true)

    this.setThumbStyles(el, group, itemCoords)

    reflow(el)
  }

  handleThumbEntered = () => {
    this.setShowThumb(false)
    this.setInTransition(false)
  }

  handleThumbEntering = (el: HTMLElement) => {
    const { group, history, items } = this.states

    const target = items.get(history[1])

    if (!target || !group) return

    this.setThumbStyles(el, group, getClientCoords(target))
  }

  setHistory = (value: SegmentedType) => {
    const { history } = this.states

    this.states.history = [history[1], value]
  }

  setInTransition = (value: boolean) => {
    this.states.inTransition = value
  }

  setItem = (value: SegmentedType, el: HTMLElement | null) => {
    const { items } = this.states

    el ? items.set(value, el) : items.delete(value)
  }

  setShowThumb = (value: boolean) => {
    const { showThumb } = this.states

    if (showThumb !== value) this.forceUpdate()

    this.states.showThumb = value
  }

  setThumb = (el: HTMLDivElement | null) => {
    const { thumb } = this.states

    if (!el && thumb) this.states.latest = getClientCoords(thumb)

    this.states.thumb = el
  }

  setThumbStyles = (el: HTMLElement, group: HTMLElement, itemCoords: DOMRect) => {
    const groupCoords = getClientCoords(group)

    const delta = itemCoords.left - groupCoords.left

    el.style.setProperty('transform', `translate3d(${delta}px, 0, 0)`)

    el.style.setProperty('width', `${itemCoords.width}px`)
  }

  constructor(
    private forceUpdate: () => void,
    private states: SegmentedState,
  ) {}
}

export default function useSegmentedStore(active: SegmentedType) {
  const update = useForceUpdate()

  const states = useConstant(() => new SegmentedState(active))

  const actions = useMemo(() => new SegmentedAction(update, states), [update, states])

  const returnEarly = useWatchValue(active, () => {
    actions.setHistory(active)
    actions.setShowThumb(true)

    return states.showThumb !== true
  })

  return { actions, returnEarly, states }
}
