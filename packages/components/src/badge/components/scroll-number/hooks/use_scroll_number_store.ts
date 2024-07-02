import { getClientCoords, reflow } from '@kpi-ui/utils'
import { useConstant, useForceUpdate, useWatchValue } from '_shared/hooks'
import { useMemo } from 'react'

import type { ScrollNumberProps } from '../props'

export class ScrollNumberState {
  $wrap = {
    current: null as HTMLDivElement | null,
  }

  history: [null | string, string]

  items = new Map<null | string, HTMLElement | null>()

  showRawChar = true

  constructor(char: string) {
    this.history = [null, char]
  }

  get wrap() {
    return this.$wrap.current
  }
}

export class ScrollNumberAction {
  onEnter = (el: HTMLElement) => {
    const { history, items, wrap } = this.states

    const item = items.get(history[0])

    if (!wrap || !item) return

    this.setOffsetStyles(el, wrap, item)

    reflow(el)
  }

  onEntered = () => {
    this.setShowRawChar(true)
  }

  onEntering = (el: HTMLElement) => {
    const { history, items, wrap } = this.states

    const item = items.get(history[1])

    if (!wrap || !item) return

    this.setOffsetStyles(el, wrap, item)
  }

  setHistory = (char: string) => {
    const { history } = this.states

    this.states.history = [history[1], char]
  }

  setItem = (key: string, el: HTMLElement | null) => {
    this.states.items.set(key, el)
  }

  setOffsetStyles = (el: HTMLElement, wrap: HTMLElement, item: HTMLElement) => {
    const wrapCoords = getClientCoords(wrap)

    const itemCoords = getClientCoords(item)

    const delta = wrapCoords.top - itemCoords.top

    el.style.setProperty('transform', `translate3d(0, ${delta}px, 0)`)
  }

  setShowRawChar = (value: boolean) => {
    const { showRawChar } = this.states

    if (showRawChar !== value) this.forceUpdate()

    this.states.showRawChar = value
  }

  constructor(
    private forceUpdate: () => void,
    private states: ScrollNumberState,
  ) {}
}

export default function useScrollNumberStore(props: ScrollNumberProps) {
  const { char } = props

  const update = useForceUpdate()

  const states = useConstant(() => new ScrollNumberState(char))

  const action = useMemo(() => new ScrollNumberAction(update, states), [update, states])

  let returnEarly = false

  useWatchValue(char, () => {
    returnEarly = states.showRawChar !== false

    action.setHistory(char)

    action.setShowRawChar(false)
  })

  return { action, returnEarly, states }
}
