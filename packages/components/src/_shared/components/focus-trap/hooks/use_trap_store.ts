import { keyboard } from '@comps/_shared/constants'
import { useConstant } from '@comps/_shared/hooks'
import { atIndex, makeEventListener, noop } from '@internal/utils'
import { useMemo } from 'react'

import type { FocusTrapProps } from '../props'

let __stack: {
  onFocusIn: (e: FocusEvent) => void
  onKeyDown: (e: KeyboardEvent) => void
}[] = []

let __cleanupKeyDown = noop

let __cleanupFocusIn = noop

function initTrapEvent(root: Document) {
  const getTopEvent = (type: 'onFocusIn' | 'onKeyDown') => (e: any) => {
    const topListeners = atIndex(__stack, -1)
    topListeners && topListeners[type](e)
  }

  __cleanupKeyDown = makeEventListener(root, 'keydown', getTopEvent('onKeyDown'), true)

  __cleanupFocusIn = makeEventListener(root, 'focusin', getTopEvent('onFocusIn'))
}

export class FocusTrapState {
  $content = {
    current: null as HTMLElement | null,
  }

  $end = {
    current: null as HTMLDivElement | null,
  }

  $start = {
    current: null as HTMLDivElement | null,
  }

  isShiftTab = false

  latestFocus: HTMLElement | null = null

  returnFocus: Element | null = null
}

export class FocusTrapAction {
  focusElement = (el: HTMLElement | null) => {
    el && el.focus({ preventScroll: true })
  }

  onCleanup = () => {
    this.states.latestFocus = null

    this.states.returnFocus = null
  }

  onFocusTrap = (root: Document, getTabbable: FocusTrapProps['getTabbable']) => {
    const onKeyDown = (e) => {
      this.states.isShiftTab = e.key === keyboard.tab && e.shiftKey
    }

    const onFocusIn = (e: FocusEvent) => {
      e.stopImmediatePropagation()

      const target = e.target as HTMLElement

      const { $content, $end, $start, isShiftTab, latestFocus } = this.states

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

    const listeners = { onFocusIn, onKeyDown }

    __stack.push(listeners)

    if (__stack.length === 1) initTrapEvent(root)

    return () => {
      __stack = __stack.filter(item => item !== listeners)

      if (!__stack.length) {
        __cleanupFocusIn()

        __cleanupKeyDown()
      }
    }
  }

  setLatestFocus = (value: HTMLElement | null) => {
    this.states.latestFocus = value
  }

  setReturnFocus = (value: Element | null) => {
    this.states.returnFocus = value
  }

  constructor(private states: FocusTrapState) {}
}
export default function useFocusTrapStore() {
  const states = useConstant(() => new FocusTrapState())

  const actions = useMemo(() => new FocusTrapAction(states), [states])

  return { actions, states }
}
