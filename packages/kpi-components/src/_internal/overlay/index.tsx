import { useDerivedState } from '@kpi-ui/hooks'
import { withDefaults } from '@kpi-ui/utils'
import Portal from '../portal'
import { CSSTransition } from '../transition'
import useOverlayStore from './hooks/use_overlay_store'

import type { OverlayProps } from './props'

function Overlay(props: OverlayProps) {
  const { open, keepMounted, unmountOnClose, mask, transitions, classNames } = props

  const store = useOverlayStore(props)

  // 当 open 变化时
  useDerivedState(open, () => {
    if (!open) return

    store.setIsInitial(false)
    store.setShouldMounted(true)
  })

  useDerivedState(unmountOnClose, () => {
    if (!unmountOnClose) return
    store.setShouldMounted(!unmountOnClose || !!keepMounted)
  })

  if (!keepMounted && !store.shouldMounted) {
    if (!open && !store.inTransition) return null
  }

  return (
    <Portal container={props.container}>
      <div className={classNames?.root}>
        {!!mask && (
          <CSSTransition appear when={open} name={transitions?.mask} mountOnEnter={!keepMounted}>
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
            mountOnEnter={!keepMounted}
            onEnter={() => {
              store.setInTransition(true)
              store.setShouldMounted(true)
            }}
            onExited={() => {
              store.setInTransition(false)
              store.setShouldMounted(!!keepMounted)
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
