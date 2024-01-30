// utils
import { useConstant } from '@kpi-ui/hooks'
import { Keyboard } from '../../../_shared/constants'
// types

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

  isShiftTab = false

  setIsShiftTab = (e: KeyboardEvent) => {
    this.isShiftTab = e.key === Keyboard.tab && e.shiftKey
  }

  returnTo: Element | null = null

  setReturnTo = (value: Element | null) => {
    this.returnTo = value
  }

  related: HTMLElement | null = null

  setRelated = (value: HTMLElement | null) => {
    this.related = value
  }

  isSentinelFocus = (active: Element | null) => {
    return active === this.$start || active === this.$end
  }

  focus = (node: HTMLElement | null) => {
    node && node.focus({ preventScroll: true })
  }

  cleanup = () => {
    this.related = null

    this.returnTo = null
  }
}

export default function useFocusTrapStore() {
  const store = useConstant(() => new FocusTrapStore())

  return store
}
