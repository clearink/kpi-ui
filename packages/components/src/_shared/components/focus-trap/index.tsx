import { useComposeRefs, useEvent } from '@comps/_shared/hooks'
import { attachDisplayName, withDefaults } from '@comps/_shared/utils'
import { nextFrame, ownerDocument } from '@internal/utils'
import { cloneElement, useEffect } from 'react'

import { guardStyles } from './constants'
import useFocusTrapStore from './hooks/use_trap_store'
import { type FocusTrapProps, defaultFocusTrapProps } from './props'

function FocusTrap(_props: FocusTrapProps) {
  const props = withDefaults(_props, defaultFocusTrapProps)

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

  const tabIndex = active ? 0 : -1

  return (
    <>
      <div
        ref={states.$start}
        style={guardStyles}
        aria-hidden="true"
        tabIndex={tabIndex}
      />
      {cloneElement(children, { ref })}
      <div
        ref={states.$end}
        style={guardStyles}
        aria-hidden="true"
        tabIndex={tabIndex}
      />

    </>
  )
}

attachDisplayName(FocusTrap)

export default FocusTrap
