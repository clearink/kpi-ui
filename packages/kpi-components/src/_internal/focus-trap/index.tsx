// utils
import { useComposeRefs, useEvent } from '@kpi-ui/hooks'
import {
  atArray,
  nextFrame,
  noop,
  ownerDocument,
  withDefaults,
  withDisplayName,
} from '@kpi-ui/utils'
import { cloneElement, useEffect } from 'react'
import { addListener } from '../transition/_shared/utils'
import useFocusTrapStore from './hooks/use_trap_store'
import defaultGetTabbable from './utils/tabbable'
import focusTrap from './utils/trap'
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
    let cleanupTrap = noop

    const root = ownerDocument(store.$start)

    store.setReturnTo(root.activeElement)

    const runFrameCleanup = nextFrame(() => {
      store.start.focus()

      onEnter?.()

      if (!store.$content || !getTabbable) return

      cleanupTrap = focusTrap.trap()

      // cleanupKeydown = addListener(root, 'keydown', store.setIsShiftTab, true)

      // // 不能使用往 root 上面加事件，嵌套 focus trap 时会有问题
      // cleanupFocusIn = addListener(root, 'focusin', (e) => {
      //   // e.stopImmediatePropagation()
      //   // const target = e.target as HTMLElement
      //   // const container = store.$content
      //   // if (!container || !target) return
      //   // const activeNode = root.activeElement
      //   // if (!store.isSentinelFocus(activeNode)) {
      //   //   if (container.contains(target)) return store.setRelated(target)
      //   //   if (store.related) return store.focus(store.related)
      //   // }
      //   // const $tabbable = getTabbable(container)
      //   // if (!$tabbable.length) return
      //   // const needFocus = atArray($tabbable, store.isShiftTab ? -1 : 0)
      //   // needFocus.focus({ preventScroll: true })
      // })
    })

    return () => {
      runFrameCleanup()

      cleanupTrap()

      onExit?.(store.returnTo)

      store.cleanup()
    }
  })

  useEffect(() => (active ? runTrap() : undefined), [active, runTrap])

  const onFocus = (e: FocusEvent) => {
    children.props.onFocus?.(e)
    console.log('focus', e)
  }
  const onBlur = (e: FocusEvent) => {
    children.props.onBlur?.(e)
    console.log('blur', e)
  }

  return (
    <>
      <div ref={store.start} tabIndex={active ? 0 : -1} style={hidden}></div>
      {cloneElement(children, { ref, onFocus, onBlur })}
      <div ref={store.end} aria-hidden="true" tabIndex={active ? 0 : -1} style={hidden}></div>
    </>
  )
}

export default withDisplayName(FocusTrap)
