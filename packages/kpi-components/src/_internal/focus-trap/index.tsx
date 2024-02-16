// utils
import { useComposeRefs, useEvent } from '@kpi-ui/hooks'
import { nextFrame, ownerDocument, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { cloneElement, useEffect } from 'react'
import useFocusTrapStore from './hooks/use_trap_store'
import defaultGetTabbable from './utils/tabbable'
// types
import type { FocusTrapProps } from './props'

const hidden: React.CSSProperties = {
  position: 'fixed',
  width: 1,
  height: 0,
  padding: 0,
  overflow: 'hidden',
  top: 1,
  left: 1,
}

export const defaultProps: Partial<FocusTrapProps> = {
  getTabbable: defaultGetTabbable,
}

function FocusTrap(_props: FocusTrapProps) {
  const props = withDefaults(_props, defaultProps)

  const { children, active, onEnter, onExit, getTabbable } = props

  const store = useFocusTrapStore()

  const ref = useComposeRefs(store.content, (children as any).ref)

  const runTrap = useEvent(() => {
    if (!store.$content || !getTabbable) return

    const root = ownerDocument(store.$start)

    store.setReturnTo(root.activeElement)

    const runFrameCleanup = nextFrame(() => {
      store.start.focus()
      onEnter?.()
    })

    const runTrapCleanup = store.trap(root, getTabbable)

    return () => {
      runFrameCleanup()

      runTrapCleanup()

      onExit?.(store.returnTo)

      store.cleanup()
    }
  })

  useEffect(() => (active ? runTrap() : undefined), [active, runTrap])

  return (
    <>
      <div ref={store.start} tabIndex={active ? 0 : -1} style={hidden}></div>
      {cloneElement(children, { ref })}
      <div ref={store.end} aria-hidden="true" tabIndex={active ? 0 : -1} style={hidden}></div>
    </>
  )
}

export default withDisplayName(FocusTrap)
