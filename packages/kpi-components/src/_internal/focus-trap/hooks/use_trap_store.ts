// utils
import { useConstant } from '@kpi-ui/hooks'
import { Keyboard } from '../../../_shared/constants'
// types

export class FocusTrapStore {
  start = {
    current: null as HTMLDivElement | null,
    focus: () => {
      const el = this.$start
      el && el.focus({ preventScroll: true })
    },
  }

  get $start() {
    return this.start.current
  }

  content = {
    current: null as HTMLElement | null,
    focus: () => {
      const el = this.$content
      el && el.focus({ preventScroll: true })
    },
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

  isShiftTab = false

  setIsShiftTab = (e: KeyboardEvent) => {
    this.isShiftTab = e.key === Keyboard.tab && e.shiftKey
  }

  isSentinelFocus = (root: Document) => {
    const active = root.activeElement

    return active === this.$start || active === this.$end
  }

  focusNode: Element | null = null

  setFocusNode = (value: Element | null) => {
    this.focusNode = value
  }

  exitHook: undefined | (() => void) = undefined

  setExitHook = (value: undefined | (() => void)) => {
    this.exitHook = value
  }

  runExitHook = () => {
    this.exitHook && this.exitHook()

    this.exitHook = undefined
  }
}

export default function useFocusTrapStore() {
  const store = useConstant(() => new FocusTrapStore())

  return store
}
