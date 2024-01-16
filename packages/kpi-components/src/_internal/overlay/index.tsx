import { withDefaults } from '@kpi-ui/utils'
import Portal from '../portal'
import { CSSTransition } from '../transition'
import useOverlayStore from './hooks/use_overlay_store'

import type { OverlayProps } from './props'

function Overlay(props: OverlayProps) {
  const { open, keepMounted, unmountOnExit, mask, transitions, classNames } = props

  const store = useOverlayStore(props)

  if (!open && !store.isMounted) return null

  return (
    <Portal container={props.container}>
      <div className={classNames?.root}>
        {!!mask && (
          <CSSTransition appear when={open} name={transitions?.mask} mountOnEnter={!keepMounted}>
            <div aria-hidden="true" className={classNames?.mask}></div>
          </CSSTransition>
        )}
        <div tabIndex={-1} ref={store.wrap.stash} className={classNames?.wrap}>
          <CSSTransition
            appear
            when={open}
            name={transitions?.content}
            mountOnEnter={!keepMounted}
            onEnter={() => {
              store.wrap.show()
              store.setIsMounted(true)
            }}
            onExited={() => {
              store.wrap.hide()
              store.setIsMounted(!(unmountOnExit && !keepMounted))
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
