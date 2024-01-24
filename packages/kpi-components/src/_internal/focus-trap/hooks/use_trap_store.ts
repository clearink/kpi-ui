// utils
import { useConstant } from '@kpi-ui/hooks'
// types
import type { FocusTrapProps } from '../props'

export class FocusTrapStore {
  start = {
    current: null as HTMLDivElement | null,
    focus: () => {
      const el = this.start.current
      el && el.focus()
    },
  }

  content = {
    current: null as HTMLElement | null,
    focus: () => {
      const el = this.content.current
      el && el.focus()
    },
  }

  end = {
    current: null as HTMLDivElement | null,
    focus: () => {
      const el = this.end.current
      el && el.focus()
    },
  }

  constructor(props: FocusTrapProps) {}
}

export default function useFocusTrapStore(props: FocusTrapProps) {
  const store = useConstant(() => new FocusTrapStore(props))

  return store
}
