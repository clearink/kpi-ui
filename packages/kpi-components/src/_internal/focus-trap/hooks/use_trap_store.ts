// utils
import { useConstant } from '@kpi-ui/hooks'
import { atIndex, noop } from '@kpi-ui/utils'
import { useMemo } from 'react'
import { Keyboard } from '../../../_shared/constants'
import { addListener } from '../../transition/_shared/utils'
// types
import type { FocusTrapProps } from '../props'

let __stack: {
  onKeyDown: (e: KeyboardEvent) => void
  onFocusIn: (e: FocusEvent) => void
}[] = []

let __cleanupKeyDown = noop

let __cleanupFocusIn = noop

const initTrapEvent = (root: Document) => {
  const getTopEvent = (type: 'onKeyDown' | 'onFocusIn') => (e: any) => {
    const topListeners = atIndex(__stack, -1)
    topListeners && topListeners[type](e)
  }

  __cleanupKeyDown = addListener(root, 'keydown', getTopEvent('onKeyDown'), true)

  __cleanupFocusIn = addListener(root, 'focusin', getTopEvent('onFocusIn'))
}

export class FocusTrapState {
  $start = {
    current: null as HTMLDivElement | null,
  }

  $content = {
    current: null as HTMLElement | null,
  }

  $end = {
    current: null as HTMLDivElement | null,
  }

  isShiftTab = false

  latestFocus: HTMLElement | null = null

  returnFocus: Element | null = null
}

export class FocusTrapAction {
  constructor(private states: FocusTrapState) {}

  setReturnFocus = (value: Element | null) => {
    this.states.returnFocus = value
  }

  setLatestFocus = (value: HTMLElement | null) => {
    this.states.latestFocus = value
  }

  focusElement = (el: HTMLElement | null) => {
    el && el.focus({ preventScroll: true })
  }

  onCleanup = () => {
    this.states.latestFocus = null

    this.states.returnFocus = null
  }

  onFocusTrap = (root: Document, getTabbable: FocusTrapProps['getTabbable']) => {
    const onKeyDown = (e) => {
      this.states.isShiftTab = e.key === Keyboard.tab && e.shiftKey
    }

    const onFocusIn = (e: FocusEvent) => {
      e.stopImmediatePropagation()

      const target = e.target as HTMLElement

      const { $start, $content, $end, isShiftTab, latestFocus } = this.states

      const container = $content.current

      if (!container || !target) return

      const active = root.activeElement

      if (active !== $start.current && active !== $end.current) {
        if (container.contains(target)) return this.setLatestFocus(target)

        if (latestFocus) return this.focusElement(latestFocus)
      }

      const tabbable = getTabbable!(container)

      if (!tabbable.length) return

      this.focusElement(atIndex(tabbable, isShiftTab ? -1 : 0))
    }

    const listeners = { onKeyDown, onFocusIn }

    __stack.push(listeners)

    if (__stack.length === 1) initTrapEvent(root)

    return () => {
      __stack = __stack.filter((item) => item !== listeners)

      if (!__stack.length) {
        __cleanupFocusIn()

        __cleanupKeyDown()
      }
    }
  }
}
export default function useFocusTrapStore() {
  const states = useConstant(() => new FocusTrapState())

  const actions = useMemo(() => new FocusTrapAction(states), [states])

  return { states, actions }
}
