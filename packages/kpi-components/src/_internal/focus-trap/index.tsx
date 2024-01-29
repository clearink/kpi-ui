// utils
import { useComposeRefs, useEvent } from '@kpi-ui/hooks'
import { atArray, nextFrame, ownerDocument, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { cloneElement, useEffect } from 'react'
import { addListener } from '../transition/_shared/utils'
import useFocusTrapStore from './hooks/use_trap_store'
import defaultGetTabbable from './utils/tabbable'
// types
import type { FocusTrapProps } from './props'

const hidden: React.CSSProperties = {
  position: 'absolute',
  width: 0,
  height: 0,
}

export const defaultProps: Partial<FocusTrapProps> = {
  getTabbable: defaultGetTabbable,
}

function FocusTrap(_props: FocusTrapProps) {
  const props = withDefaults(_props, defaultProps)

  const { children, active, onEnter, onExit, getTabbable } = props

  const store = useFocusTrapStore()

  const runTrap = useEvent(() => {
    const root = ownerDocument(store.$start)

    store.setFocusNode(root.activeElement)

    const runFrameCleanup = nextFrame(() => {
      store.start.focus()

      onEnter && onEnter()

      if (!store.$content || !getTabbable) return

      const cleanupKeydown = addListener(root, 'keydown', store.setIsShiftTab, true)

      const cleanupFocusIn = addListener(root, 'focusin', (e) => {
        e.stopImmediatePropagation()
        const target = e.target as HTMLElement

        const container = store.$content

        if (!container || !target) return

        if (!store.isSentinelFocus(root)) {
          if (container.contains(target)) return

          const related = e.relatedTarget as HTMLElement | null

          if (related && container.contains(related)) {
            return related.focus({ preventScroll: true })
          }
        }

        const $tabbable = getTabbable(container)

        if (!$tabbable.length) return

        const needFocus = atArray($tabbable, store.isShiftTab ? -1 : 0)

        needFocus.focus({ preventScroll: true })
      })

      store.setExitHook(() => {
        cleanupFocusIn()
        cleanupKeydown()
      })
    })

    return () => {
      runFrameCleanup()

      store.runExitHook()

      onExit && onExit(store.focusNode)

      store.setFocusNode(null)
    }
  })

  useEffect(() => (active ? runTrap() : undefined), [active, runTrap])

  const ref = useComposeRefs(store.content, (children as any).ref)

  return (
    <>
      <div ref={store.start} aria-hidden="true" tabIndex={active ? 0 : -1} style={hidden}></div>
      {cloneElement(children, { ref })}
      <div ref={store.end} aria-hidden="true" tabIndex={active ? 0 : -1} style={hidden}></div>
    </>
  )
}

export default withDisplayName(FocusTrap)
