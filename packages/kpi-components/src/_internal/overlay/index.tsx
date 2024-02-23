// utils
import { cls, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { useSemanticStyles } from '../../_shared/hooks'
import useOverlayLevel from './hooks/use_overlay_level'
import useOverlayStore from './hooks/use_overlay_store'
// comps
import Portal from '../portal'
import { CSSTransition } from '../transition'
import ForwardFunctional from './components/forward-functional'
// types
import type { ReactElement, RefCallback } from 'react'
import type { OverlayProps } from './props'

export const defaultProps: Partial<OverlayProps> = { mask: true }

function Overlay(_props: OverlayProps) {
  const props = withDefaults(_props, defaultProps)

  const { open, keepMounted, unmountOnExit, transitions = {}, classNames = {} } = props

  const styles = useSemanticStyles(props.style, props.styles)

  const [store, returnEarly] = useOverlayStore(props)

  const level = useOverlayLevel(store, props)

  // TODO: lock scroll

  if (returnEarly || !store.isMounted) return null

  return (
    <Portal getContainer={props.getContainer}>
      <div
        className={cls(props.className, classNames.root)}
        style={withDefaults(styles.root || {}, { zIndex: level })}
      >
        {!!props.mask && (
          <CSSTransition appear when={open} name={transitions.mask}>
            <div aria-hidden="true" className={classNames.mask} style={styles.mask}></div>
          </CSSTransition>
        )}
        <CSSTransition
          appear
          ref={store.$content}
          when={open}
          name={transitions.content}
          onEnter={(el, appearing) => {
            props.onEnter?.(el, appearing)
            store.setIsMounted(true)
          }}
          onEntering={props.onEntering}
          onEntered={props.onEntered}
          onExit={props.onExit}
          onExiting={props.onExiting}
          onExited={(el) => {
            props.onExited?.(el)
            store.setIsMounted(!(unmountOnExit && !keepMounted))
          }}
        >
          <ForwardFunctional<ReactElement, RefCallback<HTMLDivElement>>>
            {props.children}
          </ForwardFunctional>
        </CSSTransition>
      </div>
    </Portal>
  )
}

export default withDisplayName(Overlay)
