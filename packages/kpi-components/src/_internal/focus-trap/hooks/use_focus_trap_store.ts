// utils
import { useConstant } from '@kpi-ui/hooks'
// types
import type { FocusTrapProps } from '../props'

export class FocusTrapStore {
  sentinel = {
    start: { current: null as HTMLDivElement | null },
    content: { current: null as HTMLElement | null },
    end: { current: null as HTMLDivElement | null },
  }
  constructor(props: FocusTrapProps) {}
}

export default function useFocusTrapStore(props: FocusTrapProps) {
  const store = useConstant(() => new FocusTrapStore(props))

  return store
}
