// utils
import { useConstant } from '@kpi-ui/hooks'
import { atIndex, noop } from '@kpi-ui/utils'
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

export class FocusTrapStore {
  $start = {
    current: null as HTMLDivElement | null,
  }

  $content = {
    current: null as HTMLElement | null,
  }

  $end = {
    current: null as HTMLDivElement | null,
  }

  focus = (node: HTMLElement | null) => {
    node && node.focus({ preventScroll: true })
  }

  shiftTab = false

  returnFocus: Element | null = null

  setReturnFocus = (value: Element | null) => {
    this.returnFocus = value
  }

  related: HTMLElement | null = null

  setRelated = (value: HTMLElement | null) => {
    this.related = value
  }

  cleanup = () => {
    this.related = null

    this.returnFocus = null
  }

  init = (root: Document) => {
    const getTopEvent = (type: 'onKeyDown' | 'onFocusIn') => (e: any) => {
      const topListeners = atIndex(__stack, -1)
      topListeners && topListeners[type](e)
    }

    __cleanupKeyDown = addListener(root, 'keydown', getTopEvent('onKeyDown'), true)

    __cleanupFocusIn = addListener(root, 'focusin', getTopEvent('onFocusIn'))
  }

  trap = (root: Document, getTabbale: FocusTrapProps['getTabbable']) => {
    const onKeyDown = (e) => {
      this.shiftTab = e.key === Keyboard.tab && e.shiftKey
    }

    const onFocusIn = (e: FocusEvent) => {
      e.stopImmediatePropagation()

      const target = e.target as HTMLElement

      const container = this.$content.current

      if (!container || !target) return

      const active = root.activeElement

      if (active !== this.$start.current && active !== this.$end.current) {
        if (container.contains(target)) return this.setRelated(target)
        if (this.related) return this.focus(this.related)
      }

      const tabbable = getTabbale!(container)

      if (!tabbable.length) return

      this.focus(atIndex(tabbable, this.shiftTab ? -1 : 0))
    }

    const listeners = { onKeyDown, onFocusIn }

    __stack.push(listeners)

    if (__stack.length === 1) this.init(root)

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
  const store = useConstant(() => new FocusTrapStore())

  return store
}
