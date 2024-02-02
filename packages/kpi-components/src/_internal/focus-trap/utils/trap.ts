import { atIndex, nextFrame, noop, ownerDocument } from '@kpi-ui/utils'
import { addListener } from '../../../_shared/utils'
import { Keyboard } from '../../../_shared/constants'

class FocusTrap {
  private stack: {
    onKeyDown: (e: KeyboardEvent) => void
    onFocus: (e: FocusEvent) => void
  }[] = []

  private cleanupKeydown = noop

  private cleanupFocusin = noop

  private isShiftTab = false

  private setIsShiftTab = (e: KeyboardEvent) => {
    this.isShiftTab = e.key === Keyboard.tab && e.shiftKey
  }

  private lastFocus: HTMLElement | null = null

  private setLastFocus = (value: HTMLElement) => {
    this.lastFocus = value
  }

  trap = (options: {
    root: Document
    onKeyDown: (e: KeyboardEvent) => void
    onFocus: (e: FocusEvent) => void
  }) => {
    const { root, onKeyDown, onFocus } = options

    const listeners = { onKeyDown, onFocus }

    this.stack.push(listeners)

    if (this.stack.length === 1) {
      this.cleanupKeydown = addListener(
        root,
        'keydown',
        (e) => {
          const topListeners = atIndex(this.stack, -1)
          topListeners && topListeners.onKeyDown(e)
        },
        true
      )

      this.cleanupFocusin = addListener(root, 'focusin', (e) => {
        const topListeners = atIndex(this.stack, -1)
        topListeners && topListeners.onFocus(e)
      })
    }

    return () => {
      this.stack = this.stack.filter((item) => item !== listeners)

      if (this.stack.length) return

      this.cleanupFocusin()

      this.cleanupKeydown()
    }
  }
}

export default new FocusTrap()
