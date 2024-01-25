// utils
import { useComposeRefs, useEvent } from '@kpi-ui/hooks'
import {
  atArray,
  isBrowser,
  logger,
  nextFrame,
  ownerDocument,
  withDefaults,
  withDisplayName,
} from '@kpi-ui/utils'
import { cloneElement, useEffect } from 'react'
import { Keyboard } from '../../_shared/constants'
import useFocusTrapEvent from './hooks/use_trap_event'
import useFocusTrapStore from './hooks/use_trap_store'
import { addListener } from '../transition/_shared/utils'
// types
import type { FocusEvent } from 'react'
import type { FocusTrapProps } from './props'

const hidden: React.CSSProperties = {
  position: 'absolute',
  width: 0,
  height: 0,
}

export const defaultProps: Partial<FocusTrapProps> = {}

// 焦点聚焦
function FocusTrap(_props: FocusTrapProps) {
  const props = withDefaults(_props, defaultProps)

  const { children, active, autoFocus } = props

  const store = useFocusTrapStore(props)

  // const [handleLoopFocus, handleDetectContain] = useFocusTrapEvent(store, props)

  const runFocus = useEvent(() => {})

  // 尽量模仿 CSSTransition 组件的写法
  useEffect(() => {
    if (!active) return

    const runFrameCleanup = nextFrame(() => {
      if (autoFocus) {
        // 获取 tabbable 元素
      } else {
        store.start.focus()
      }
    })

    return runFrameCleanup()
  }, [runFocus, active, store, autoFocus])

  const ref = useComposeRefs(store.content, (children as any).ref)

  // useEffect(() => {
  //   const $content = store.content.current

  //   if (!$content || !isBrowser()) return

  //   const root = ownerDocument($content)

  //   const contain = () => {
  //     const el = store.content.current

  //     if (!el) return

  //     let $tabbable: HTMLElement[] = []
  //     if (root.activeElement === store.start.current || root.activeElement === store.end.current) {
  //       $tabbable = getTabbable!(el)
  //     }
  //     console.log($tabbable)

  //     if ($tabbable.length) {
  //       const first = atIndex($tabbable, 0)
  //       const last = atIndex($tabbable, -1)
  //       const isShiftTab = false
  //       isShiftTab ? last.focus() : first.focus()
  //     } else store.content.focus()
  //   }

  //   const loopFocus = (e: KeyboardEvent) => {
  //     console.log('last keydown', e, e.key)
  //     if (e.key !== Keyboard.tab) return

  //     if (root.activeElement === $content && e.shiftKey) {
  //       // shift + tab
  //       store.end.focus()
  //     }
  //   }

  //   const cleanupKeydown = addListener(root, 'keydown', handleLoopFocus)
  //   const cleanupContain = addListener(root, 'focusin', handleDetectContain, true)

  //   return () => {
  //     cleanupKeydown()
  //     cleanupContain()
  //   }
  // }, [handleDetectContain, handleLoopFocus, store])

  const handleSentinelFocus = (e: FocusEvent<HTMLDivElement>) => {
    // store
    console.log('sentinel focus', e, e.relatedTarget)
  }

  const handleContentFocus = useEvent((e: FocusEvent<HTMLDivElement>) => {
    console.log('content focus', e)
    const original = children.props.onFocus
    original && original(e)
  })

  return (
    <>
      <div
        ref={store.start}
        aria-hidden="true"
        tabIndex={active ? 0 : -1}
        style={hidden}
        onFocus={handleSentinelFocus}
      ></div>
      {cloneElement(children, { ref, onFocus: handleContentFocus })}
      <div
        ref={store.end}
        aria-hidden="true"
        tabIndex={active ? 0 : -1}
        style={hidden}
        onFocus={handleSentinelFocus}
      ></div>
    </>
  )
}

export default withDisplayName(FocusTrap)
