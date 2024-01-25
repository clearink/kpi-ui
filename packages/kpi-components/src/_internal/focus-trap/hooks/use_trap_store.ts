// utils
import { useConstant } from '@kpi-ui/hooks'
// types
import type { FocusTrapProps } from '../props'

export class FocusTrapStore {
  start = {
    current: null as HTMLDivElement | null,
    focus: () => {
      const el = this.start.current
      el && el.focus({ preventScroll: true })
    },
  }

  content = {
    current: null as HTMLElement | null,
    focus: () => {
      const el = this.content.current
      el && el.focus({ preventScroll: true })
    },
  }

  end = {
    current: null as HTMLDivElement | null,
    focus: () => {
      const el = this.end.current
      el && el.focus({ preventScroll: true })
    },
  }

  constructor(props: FocusTrapProps) {}
}

export default function useFocusTrapStore(props: FocusTrapProps) {
  const store = useConstant(() => new FocusTrapStore(props))

  return store
}
