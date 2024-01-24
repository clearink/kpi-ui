// utils
import { useEvent } from '@kpi-ui/hooks'
import { Keyboard } from '../../../_shared/constants'
// types
import type { FocusTrapProps } from '../props'
import type useFocusTrapStore from './use_trap_store'

export default function useFocusTrapEvent(
  store: ReturnType<typeof useFocusTrapStore>,
  props: FocusTrapProps
) {
  const handleFocusActive = useEvent((e: KeyboardEvent) => {
    console.log('last keydown', e, e.key)
    if (e.key !== Keyboard.tab) return
    const $content = store.content.current

    if (root.activeElement === $content && e.shiftKey) {
      // shift + tab
      store.end.focus()
    }
  })
  const handleFocusInactive = useEvent(() => {})
  return [handleLoopFocus, handleDetectContain] as const
}
