import { atArray, noop, ownerDocument } from '@kpi-ui/utils'
import { addListener } from '../../../_shared/utils'
import { Keyboard } from '../../../_shared/constants'

class FocusTrap {
  private stack: HTMLElement[] = []

  private cleanupKeydown = noop

  private cleanupFocusin = noop

  private isShiftTab = false

  private setIsShiftTab = (e: KeyboardEvent) => {
    this.isShiftTab = e.key === Keyboard.tab && e.shiftKey
  }

  private focus = (el?: HTMLElement) => {
    el && el.focus({ preventScroll: true })
  }

  trap = (options: {
    el: HTMLElement
    isSentinelFocus: (target: HTMLElement) => boolean
    getTabbable: (el: HTMLElement) => HTMLElement[]
  }) => {
    const { el, isSentinelFocus, getTabbable } = options

    this.stack.push(el)

    if (this.stack.length === 1) {
      const root = ownerDocument(el)

      this.cleanupKeydown = addListener(root, 'keydown', this.setIsShiftTab, true)

      this.cleanupFocusin = addListener(root, 'focusin', (e) => {
        e.stopImmediatePropagation()

        const target = e.target as HTMLElement

        const current = atArray(this.stack, -1)

        if (!current || !target || el !== current) return

        console.log('needFocus', target, el === current)

        if (!isSentinelFocus(target)) {
          if (current.contains(target)) return // this.setRelated(target)

          // if(this.related) return this.focusRe
        }

        const doms = getTabbable(el)

        if (!doms.length) return

        const needFocus = atArray(doms, this.isShiftTab ? -1 : 0)
        this.focus(needFocus)
      })
    }

    return () => {
      this.stack = this.stack.filter((item) => item !== el)

      if (this.stack.length) return

      this.cleanupFocusin()
      this.cleanupKeydown()
    }
  }
}

export default new FocusTrap()
