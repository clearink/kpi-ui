import { useDerivedState, useForceUpdate } from '@kpi-ui/hooks'
import { withDefaults } from '@kpi-ui/utils'
import { usePrefixCls } from '../../_shared/hooks'
import Portal from '../portal'
import { CSSTransition } from '../transition'
import useOverlayStore from './hooks/use_overlay_store'

import type { OverlayProps } from './props'

function Overlay(props: OverlayProps) {
  const { open, forceRender, destroyOnClose, mask, transitions, classNames } = props

  const store = useOverlayStore(props)

  const forceUpdate = useForceUpdate()

  useDerivedState(open, () => {
    if (!open) return

    if (!store.shouldRender) forceUpdate()

    store.setShouldRender(true)

    store.setIsInitial(false)
  })

  useDerivedState(destroyOnClose, () => {
    destroyOnClose && store.setShouldRender(open || false)
  })

  // 立即渲染, 只会生效一次
  const immediate = forceRender && store.isInitial

  return (
    <Portal visible={store.shouldRender} container={props.container} forceRender={immediate}>
      <div className={classNames?.root}>
        {!!mask && (
          <CSSTransition appear when={open} name={transitions?.mask} mountOnEnter={!forceRender}>
            <div aria-hidden="true" className={classNames?.mask}></div>
          </CSSTransition>
        )}
        <div
          tabIndex={-1}
          className={classNames?.wrap}
          style={store.inTransition ? undefined : { display: 'none' }}
        >
          <CSSTransition
            appear
            when={open}
            name={transitions?.content}
            mountOnEnter={!forceRender}
            unmountOnExit={destroyOnClose}
            onEnter={() => {
              if (!store.inTransition || !store.shouldRender) forceUpdate()

              store.setShouldRender(true)
              store.setInTransition(true)
            }}
            onExited={() => {
              if (store.inTransition || store.shouldRender) forceUpdate()

              store.setInTransition(false)
              store.setShouldRender(false || !destroyOnClose)
            }}
          >
            {props.children}
          </CSSTransition>
        </div>
      </div>
    </Portal>
  )
}

export default withDefaults(Overlay, {
  mask: true,
})
