import { withDefaults, withDisplayName } from '@kpi-ui/utils'
import Portal from '../portal'
import { CSSTransition } from '../transition'
import useOverlayStore from './hooks/use_overlay_store'

import type { OverlayProps } from './props'

export const defaultProps: Partial<OverlayProps> = { mask: true }

function Overlay(_props: OverlayProps) {
  const props = withDefaults(_props, defaultProps)

  const { open, keepMounted, unmountOnExit, mask, transitions, classNames } = props

  const store = useOverlayStore(props)

  if (!open && !store.isMounted) return null

  return (
    <Portal getContainer={props.getContainer}>
      <div className={classNames?.root}>
        {!!mask && (
          <CSSTransition appear when={open} name={transitions?.mask} mountOnEnter={!keepMounted}>
            <div aria-hidden="true" className={classNames?.mask}></div>
          </CSSTransition>
        )}
        <div tabIndex={-1} ref={store.wrap} className={classNames?.wrap}>
          <CSSTransition
            appear
            ref={store.content}
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

export default withDisplayName(Overlay)
