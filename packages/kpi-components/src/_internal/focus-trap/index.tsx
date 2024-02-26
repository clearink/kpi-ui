// utils
import { useComposeRefs, useEvent } from '@kpi-ui/hooks'
import { nextFrame, ownerDocument, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { cloneElement, useEffect } from 'react'
import useFocusTrapStore from './hooks/use_trap_store'
import defaultGetTabbable from './utils/tabbable'
// types
import type { FocusTrapProps } from './props'
import batch from '../transition/utils/batch'

const hidden: React.CSSProperties = {
  position: 'fixed',
  width: 1,
  height: 0,
  padding: 0,
  overflow: 'hidden',
  top: -1,
  left: -1,
}

export const defaultProps: Partial<FocusTrapProps> = {
  getTabbable: defaultGetTabbable,
}

function FocusTrap(_props: FocusTrapProps) {
  const props = withDefaults(_props, defaultProps)

  const { children, active, onEnter, onExit, getTabbable } = props

  const { states, actions } = useFocusTrapStore()

  const ref = useComposeRefs(states.$content, (children as any).ref)

  const runFocusTrap = useEvent(() => {
    if (!states.$content || !getTabbable) return

    const root = ownerDocument(states.$start.current)

    actions.setReturnFocus(root.activeElement)

    const runFrameCleanup = nextFrame(() => {
      actions.focusElement(states.$start.current)
      onEnter?.()
    })

    const runTrapCleanup = actions.onFocusTrap(root, getTabbable)

    return () => {
      runFrameCleanup()

      runTrapCleanup()

      onExit?.(states.returnFocus)

      actions.onCleanup()
    }
  })

  // prettier-ignore
  useEffect(() => { if(active) return runFocusTrap() }, [active, runFocusTrap])

  return (
    <>
      <div ref={states.$start} tabIndex={active ? 0 : -1} style={hidden}></div>
      {cloneElement(children, { ref })}
      <div ref={states.$end} aria-hidden="true" tabIndex={active ? 0 : -1} style={hidden}></div>
    </>
  )
}

export default withDisplayName(FocusTrap)
