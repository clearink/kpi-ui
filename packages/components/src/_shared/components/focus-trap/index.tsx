import { nextFrame, ownerDocument, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { useComposeRefs, useEvent } from '_shared/hooks'
import { cloneElement, useEffect } from 'react'

import type { FocusTrapProps } from './props'

import { guardStyles } from './constants'
import useFocusTrapStore from './hooks/use_trap_store'
import defaultGetTabbable from './utils/tabbable'

const defaultProps: Partial<FocusTrapProps> = {
  getTabbable: defaultGetTabbable,
}

function FocusTrap(_props: FocusTrapProps) {
  const props = withDefaults(_props, defaultProps)

  const { active, children, getTabbable, onEnter, onExit } = props

  const { actions, states } = useFocusTrapStore()

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
      <div ref={states.$start} style={guardStyles} tabIndex={active ? 0 : -1}></div>
      {cloneElement(children, { ref })}
      <div
        aria-hidden="true"
        ref={states.$end}
        style={guardStyles}
        tabIndex={active ? 0 : -1}
      ></div>
    </>
  )
}

export default withDisplayName(FocusTrap)
