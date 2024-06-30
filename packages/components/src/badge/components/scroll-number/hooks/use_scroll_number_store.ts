import { getClientCoords, reflow } from '@kpi-ui/utils'
import { useConstant, useForceUpdate, useWatchValue } from '_shared/hooks'
import { useMemo } from 'react'
// types
import type { ScrollNumberProps } from '../props'

export class ScrollNumberState {
  items = new Map<string | null, HTMLElement | null>()

  $wrap = {
    current: null as HTMLDivElement | null,
  }

  get wrap() {
    return this.$wrap.current
  }

  showRawChar = true

  history: [string | null, string]

  constructor(char: string) {
    this.history = [null, char]
  }
}

export class ScrollNumberAction {
  constructor(private forceUpdate: () => void, private states: ScrollNumberState) {}

  setItem = (key: string, el: HTMLElement | null) => {
    this.states.items.set(key, el)
  }

  setHistory = (char: string) => {
    const { history } = this.states

    this.states.history = [history[1], char]
  }

  setShowRawChar = (value: boolean) => {
    const { showRawChar } = this.states

    if (showRawChar !== value) this.forceUpdate()

    this.states.showRawChar = value
  }

  setOffsetStyles = (el: HTMLElement, wrap: HTMLElement, item: HTMLElement) => {
    const wrapCoords = getClientCoords(wrap)

    const itemCoords = getClientCoords(item)

    const delta = wrapCoords.top - itemCoords.top

    el.style.setProperty('transform', `translate3d(0, ${delta}px, 0)`)
  }

  onEnter = (el: HTMLElement) => {
    const { wrap, history, items } = this.states

    const item = items.get(history[0])

    if (!wrap || !item) return

    this.setOffsetStyles(el, wrap, item)

    reflow(el)
  }

  onEntering = (el: HTMLElement) => {
    const { wrap, history, items } = this.states

    const item = items.get(history[1])

    if (!wrap || !item) return

    this.setOffsetStyles(el, wrap, item)
  }

  onEntered = () => {
    this.setShowRawChar(true)
  }
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

  return { returnEarly, states, action }
}
