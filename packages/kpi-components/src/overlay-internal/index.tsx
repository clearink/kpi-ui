import { isNullish, withDefaults } from '@kpi-ui/utils'
import { createPortal } from 'react-dom'
import { CSSTransition } from '../transition'
import useRenderLimit from './hooks/use_render_limit'
import getContainer from './utils/get_container'

import type { OverlayProps } from './props'

function Overlay(props: OverlayProps) {
  const { open, forceRender, destroyOnClose, children: _children, transition } = props

  if (!useRenderLimit(2)) return null

  const container = getContainer(props.container)

  console.log('container', container)

  // forceRender && !open ? false : !forceRender 虽然能解决 forceRender 的问题
  // 但是不能解决 unmountOnExit
  const children = (
    <CSSTransition
      appear
      when={open}
      mountOnEnter={forceRender && !open ? false : !forceRender}
      unmountOnExit={forceRender && !open ? false : destroyOnClose}
      name={transition}
    >
      <div className="kpi-overlay">{_children}</div>
    </CSSTransition>
  )

  if (container === false) return children

  return createPortal(children, isNullish(container) ? document.body : container)
}

export default withDefaults(Overlay)
