import { useComposeRefs, useEvent } from '_hooks'
import { nextFrame, ownerDocument, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { cloneElement, useEffect } from 'react'
import useFocusTrapStore from './hooks/use_trap_store'
import defaultGetTabbable from './utils/tabbable'
import { guardStyles } from './constants'
// types
import type { FocusTrapProps } from './props'

const defaultProps: Partial<FocusTrapProps> = {
  getTabbable: defaultGetTabbable,
}

function FocusTrap(_props: FocusTrapProps) {
  const props = withDefaults(_props, defaultProps)

  const { children, active, onEnter, onExit, getTabbable } = props

  const { states, actions } = useFocusTrapStore()

  const ref = useComposeRefs(states.$content, (children as any).ref)

  const runFocusTrap = useEvent((active: FocusTrapProps['active']) => {
    if (!active || !states.$content || !getTabbable) return

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

  useEffect(() => runFocusTrap(active), [active, runFocusTrap])

  return (
    <>
      <div ref={states.$start} tabIndex={active ? 0 : -1} style={guardStyles}></div>
      {cloneElement(children, { ref })}
      <div
        ref={states.$end}
        aria-hidden="true"
        tabIndex={active ? 0 : -1}
        style={guardStyles}
      ></div>
    </>
  )
}

export default withDisplayName(FocusTrap)
