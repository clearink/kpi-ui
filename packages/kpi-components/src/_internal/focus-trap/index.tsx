// utils
import { isBrowser, logger, supportRef, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { useComposeRefs, useEvent } from '@kpi-ui/hooks'
import { cloneElement, useEffect } from 'react'
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

  const isSupport = supportRef(children)

  if (process.env.NODE_ENV !== 'production') {
    logger(!isSupport, 'this children not supported ref prop')
  }

  useEffect(() => {
    const $content = store.content.current
    if (!$content || !isSupport || !isBrowser()) return

    const $tabbable = getTabbable!($content)

    console.log($tabbable)
  }, [getTabbable, isSupport, store.content])

  const handleSentinelFocus = (e: FocusEvent<HTMLDivElement>) => {
    // store
    console.log('sentinel focus', e)
  }

  const handleContentFocus = useEvent((e: FocusEvent<HTMLDivElement>) => {
    console.log('content focus', e)
  })

  const ref = useComposeRefs(store.content, isSupport ? children.ref : null)

  if (!isSupport) return <>{children}</>

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
