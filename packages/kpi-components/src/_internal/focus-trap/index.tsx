// utils
import { useComposeRefs, useEvent } from '@kpi-ui/hooks'
import { atIndex, isBrowser, ownerDocument, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { cloneElement, useEffect } from 'react'
import { KEY_NAME } from './constants'
import useFocusTrapStore from './hooks/use_focus_trap_store'
import defaultGetTabbable from './utils/get_tabbable'
// types
import type { FocusEvent } from 'react'
import type { FocusTrapProps } from './props'

const hidden: React.CSSProperties = {
  width: 0,
  height: 0,
  overflow: 'hidden',
  outline: 'none',
  position: 'absolute',
}

export const defaultProps: Partial<FocusTrapProps> = {
  getTabbable: defaultGetTabbable,
}

// 焦点聚焦
function FocusTrap(_props: FocusTrapProps) {
  const props = withDefaults(_props, defaultProps)

  const { children, open, getTabbable } = props

  const store = useFocusTrapStore(props)

  useEffect(() => {
    const $content = store.content.current

    if (!$content || !isBrowser()) return

    const root = ownerDocument($content)

    const contain = () => {
      const el = store.content.current

      if (!el) return

      let $tabbable: HTMLElement[] = []
      if (root.activeElement === store.start.current || root.activeElement === store.end.current) {
        $tabbable = getTabbable!(el)
      }
      console.log($tabbable)

      if ($tabbable.length) {
        const first = atIndex($tabbable, 0)
        const last = atIndex($tabbable, -1)
        const isShiftTab = false
        isShiftTab ? last.focus() : first.focus()
      } else store.content.focus()
    }

    const loopFocus = (e: KeyboardEvent) => {
      console.log('last keydown', e, e.key)
      if (e.key !== KEY_NAME.tab) return

      if (root.activeElement === $content && e.shiftKey) {
        // shift + tab
        store.end.focus()
      }
    }

    root.addEventListener('focusin', contain)
    root.addEventListener('keydown', loopFocus, true)

    return () => {
      root.removeEventListener('focusin', contain)
      root.removeEventListener('keydown', loopFocus, true)
    }
  }, [getTabbable, store])

  const handleSentinelFocus = (e: FocusEvent<HTMLDivElement>) => {
    // store
    console.log('sentinel focus', e)
  }

  const handleContentFocus = useEvent((e: FocusEvent<HTMLDivElement>) => {
    console.log('content focus', e)
    const original = children.props.onFocus
    original && original(e)
  })

  const ref = useComposeRefs(store.content, (children as any).ref)

  return (
    <>
      <div
        tabIndex={open ? 0 : -1}
        ref={store.start}
        onFocus={handleSentinelFocus}
        style={hidden}
        aria-hidden="true"
        data-sentinel="start"
      ></div>
      {cloneElement(children, { ref, onFocus: handleContentFocus })}
      <div
        tabIndex={open ? 0 : -1}
        ref={store.end}
        onFocus={handleSentinelFocus}
        style={hidden}
        aria-hidden="true"
        data-sentinel="end"
      ></div>
    </>
  )
}

export default withDisplayName(FocusTrap)
