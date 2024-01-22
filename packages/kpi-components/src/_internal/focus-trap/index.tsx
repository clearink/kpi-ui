// utils
import { withDefaults } from '@kpi-ui/utils'
import useFocusTrapStore from './hooks/use_focus_trap_store'
// types
import { FocusTrapProps } from './props'

const hidden: React.CSSProperties = {
  width: 0,
  height: 0,
  overflow: 'hidden',
  outline: 'none',
  position: 'absolute',
}

// 焦点聚焦
function FocusTrap(props: FocusTrapProps) {
  const { children } = props

  const store = useFocusTrapStore(props)

  return (
    <>
      <div
        tabIndex={0}
        ref={store.sentinel.stash}
        style={hidden}
        aria-hidden="true"
        data-sentinel="start"
      ></div>
      {children}
      <div
        tabIndex={0}
        ref={store.sentinel.end}
        style={hidden}
        aria-hidden="true"
        data-sentinel="end"
      ></div>
    </>
  )
}

export default withDefaults(FocusTrap, {})
