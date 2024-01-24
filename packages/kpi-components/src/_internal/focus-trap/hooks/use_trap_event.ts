// utils
import { useEvent } from '@kpi-ui/hooks'
import { KEYBOARD } from '../../../_shared/constants'
// types
import type { FocusTrapProps } from '../props'
import type useFocusTrapStore from './use_trap_store'

export default function useFocusTrapEvent(
  store: ReturnType<typeof useFocusTrapStore>,
  props: FocusTrapProps
) {
  const handleLoopFocus = useEvent((e: KeyboardEvent) => {
    console.log('last keydown', e, e.key)
    if (e.key !== KEYBOARD.tab) return

    if (root.activeElement === $content && e.shiftKey) {
      // shift + tab
      store.end.focus()
    }
  })
  const handleDetectContain = useEvent(() => {})
  return [handleLoopFocus, handleDetectContain] as const
}
