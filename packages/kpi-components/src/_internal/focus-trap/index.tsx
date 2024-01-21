// utils
import { withDefaults } from '@kpi-ui/utils'
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
  return (
    <>
      <div tabIndex={0} style={hidden} aria-hidden="true" data-sentinel="start"></div>
      {children}
      <div tabIndex={0} style={hidden} aria-hidden="true" data-sentinel="end"></div>
    </>
  )
}

export default withDefaults(FocusTrap, {})
