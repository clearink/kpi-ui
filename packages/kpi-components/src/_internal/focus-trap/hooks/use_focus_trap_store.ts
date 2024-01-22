// utils
import { useConstant } from '@kpi-ui/hooks'
// types
import type { FocusTrapProps } from '../props'

export class FocusTrapStore {
  sentinel = {
    stash: () => {},
  }
  constructor(props: FocusTrapProps) {}
}

export default function useFocusTrapStore(props: FocusTrapProps) {
  const store = useConstant(() => new FocusTrapStore(props))

  return store
}
