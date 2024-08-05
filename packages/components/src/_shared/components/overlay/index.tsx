import { useSemanticStyles } from '@comps/_shared/hooks'
import { attachDisplayName, cls, withDefaults } from '@comps/_shared/utils'
import { type ForwardedRef, type ReactElement, type RefCallback, forwardRef } from 'react'

import Portal from '../portal'
import { CSSTransition } from '../transition'
import ForwardFunctional from './components/forward-functional'
import useOverlayLevel from './hooks/use_overlay_level'
import useOverlayStore from './hooks/use_overlay_store'
import { type OverlayProps, type OverlayRef, defaultOverlayProps } from './props'

function _Overlay(_props: OverlayProps, ref: ForwardedRef<OverlayRef>) {
  const props = withDefaults(_props, defaultOverlayProps)

  const {
    open,
    keepMounted,
    getContainer,
    unmountOnExit,
    className,
    classNames = {},
    transitions = {},
  } = props

  const styles = useSemanticStyles(props)

  const { actions, returnEarly, states } = useOverlayStore(props)

  const level = useOverlayLevel(states.isMounted, props)

  // TODO: lock scroll

  if (returnEarly || !states.isMounted) return null

  return (
    <Portal ref={ref} getContainer={getContainer}>
      <div
        className={cls(className, classNames.root)}
        style={withDefaults(styles.root || {}, { position: 'absolute', zIndex: level })}
      >
        {!!props.mask && (
          <CSSTransition appear name={transitions.mask} when={open}>
            <div className={classNames.mask} style={styles.mask} aria-hidden="true" />
          </CSSTransition>
        )}
        <CSSTransition
          ref={states.$content}
          appear
          name={transitions.content}
          when={open}
          onEnter={(el, appearing) => {
            props.onEnter?.(el, appearing)
            actions.setIsMounted(true)
          }}
          onEntered={props.onEntered}
          onEntering={props.onEntering}
          onExit={props.onExit}
          onExited={(el) => {
            props.onExited?.(el)
            actions.setIsMounted(!(unmountOnExit && !keepMounted))
          }}
          onExiting={props.onExiting}
        >
          <ForwardFunctional<ReactElement, RefCallback<HTMLDivElement>>>
            {props.children}
          </ForwardFunctional>
        </CSSTransition>
      </div>
    </Portal>
  )
}

attachDisplayName(_Overlay)

const Overlay = forwardRef(_Overlay)

export default Overlay
