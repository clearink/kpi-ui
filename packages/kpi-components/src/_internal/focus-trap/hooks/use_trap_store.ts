// utils
import { useConstant } from '@kpi-ui/hooks'
import { Keyboard } from '../../../_shared/constants'
import { atIndex, noop } from '@kpi-ui/utils'
// types
import type { FocusTrapProps } from '../props'
import { addListener } from '../../transition/_shared/utils'

export class FocusTrapStore {
  start = {
    current: null as HTMLDivElement | null,
    focus: () => {
      this.focus(this.$start)
    },
  }

  get $start() {
    return this.start.current
  }

  content = {
    current: null as HTMLElement | null,
  }

  get $content() {
    return this.content.current
  }

  end = {
    current: null as HTMLDivElement | null,
  }

  get $end() {
    return this.end.current
  }

  focus = (node: HTMLElement | null) => {
    node?.focus({ preventScroll: true })
  }

  shiftTab = false

  returnTo: Element | null = null

  setReturnTo = (value: Element | null) => {
    this.returnTo = value
  }

  related: HTMLElement | null = null

  setRelated = (value: HTMLElement | null) => {
    this.related = value
  }

  cleanup = () => {
    this.related = null

    this.returnTo = null
  }

  static __stack: {
    onKeyDown: (e: KeyboardEvent) => void
    onFocusIn: (e: FocusEvent) => void
  }[] = []

  static __cleanupKeyDown = noop

  static __cleanupFocusIn = noop

  private init = (root: Document) => {
    const getTopEvent = (type: 'onKeyDown' | 'onFocusIn') => (e: any) => {
      const topListeners = atIndex(FocusTrapStore.__stack, -1)
      topListeners && topListeners[type](e)
    }

    FocusTrapStore.__cleanupKeyDown = addListener(root, 'keydown', getTopEvent('onKeyDown'), true)

    FocusTrapStore.__cleanupFocusIn = addListener(root, 'focusin', getTopEvent('onFocusIn'))
  }

  trap = (root: Document, getTabbale: FocusTrapProps['getTabbable']) => {
    const onKeyDown = (e) => {
      this.shiftTab = e.key === Keyboard.tab && e.shiftKey
    }

    const onFocusIn = (e: FocusEvent) => {
      e.stopImmediatePropagation()

      const target = e.target as HTMLElement
      const container = this.$content

      if (!container || !target) return

      const active = root.activeElement
      if (active !== this.$start && active !== this.$end) {
        if (container.contains(target)) return this.setRelated(target)
        if (this.related) return this.focus(this.related)
      }

      const tabbable = getTabbale!(container)

      if (!tabbable.length) return

      this.focus(atIndex(tabbable, this.shiftTab ? -1 : 0))
    }

    const listeners = { onKeyDown, onFocusIn }

    FocusTrapStore.__stack.push(listeners)

    if (FocusTrapStore.__stack.length === 1) this.init(root)

    return () => {
      FocusTrapStore.__stack = FocusTrapStore.__stack.filter((item) => item !== listeners)

      if (!FocusTrapStore.__stack.length) {
        FocusTrapStore.__cleanupFocusIn()

        FocusTrapStore.__cleanupKeyDown()
      }
    }
  }
}

export default function useFocusTrapStore() {
  const store = useConstant(() => new FocusTrapStore())

  return store
}
