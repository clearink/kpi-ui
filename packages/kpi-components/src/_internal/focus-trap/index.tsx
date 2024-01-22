// utils
import { logger, supportRef, withDefaults } from '@kpi-ui/utils'
import { useComposeRefs } from '@kpi-ui/hooks'
import { cloneElement, useEffect } from 'react'
import useFocusTrapStore from './hooks/use_focus_trap_store'
// types
import type { FocusEvent } from 'react'
import type { FocusTrapProps } from './props'

const tabbableQuery = [
  'input',
  'select',
  'textarea',
  'a[href]',
  'button',
  '[tabindex]',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
].join(',')

const hidden: React.CSSProperties = {
  width: 0,
  height: 0,
  overflow: 'hidden',
  outline: 'none',
  position: 'absolute',
}

// 焦点聚焦
function FocusTrap(props: FocusTrapProps) {
  const { children, open } = props

  const store = useFocusTrapStore(props)

  const isSupport = supportRef(children)

  if (process.env.NODE_ENV !== 'production') {
    logger(!isSupport, 'this children not supported ref prop')
  }

  useEffect(() => {
    const $content = store.sentinel.content.current
    if (!$content) return
    const $tabbable = $content.querySelectorAll(tabbableQuery) as NodeListOf<HTMLElement>
    console.log($tabbable)
  })

  const handleSentinelFocus = (e: FocusEvent<HTMLDivElement>) => {
    // store
  }
  const handleContentFocus = (e: FocusEvent<HTMLDivElement>) => {}

  const ref = useComposeRefs(store.sentinel.content, isSupport ? children.ref : null)

  if (!isSupport) return children

  return (
    <>
      <div
        tabIndex={open ? 0 : -1}
        ref={store.sentinel.start}
        onFocus={handleSentinelFocus}
        style={hidden}
        aria-hidden="true"
        data-sentinel="start"
      ></div>
      {cloneElement(children, { ref, onFocus: handleContentFocus })}
      <div
        tabIndex={open ? 0 : -1}
        ref={store.sentinel.end}
        onFocus={handleSentinelFocus}
        style={hidden}
        aria-hidden="true"
        data-sentinel="end"
      ></div>
    </>
  )
}

export default withDefaults(FocusTrap)
