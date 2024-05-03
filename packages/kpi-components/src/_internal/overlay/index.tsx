import { cls, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { forwardRef, type ForwardedRef, type ReactElement, type RefCallback } from 'react'
import { useSemanticStyles } from '../../_shared/hooks'
import useOverlayLevel from './hooks/use_overlay_level'
import useOverlayStore from './hooks/use_overlay_store'
// comps
import Portal from '../portal'
import { CSSTransition } from '../transition'
import ForwardFunctional from './components/forward-functional'
// types
import type { OverlayProps, OverlayRef } from './props'

const defaultProps: Partial<OverlayProps> = { mask: true }

function Overlay(_props: OverlayProps, ref: ForwardedRef<OverlayRef>) {
  const props = withDefaults(_props, defaultProps)

  const {
    open,
    keepMounted,
    unmountOnExit,
    getContainer,
    transitions = {},
    classNames = {},
  } = props

  const styles = useSemanticStyles(props.style, props.styles)

  const { states, actions, returnEarly } = useOverlayStore(props)

  const level = useOverlayLevel(states.isMounted, props)

  // TODO: lock scroll

  if (returnEarly || !states.isMounted) return null

  return (
    <Portal ref={ref} getContainer={getContainer}>
      <div
        className={cls(props.className, classNames.root)}
        style={withDefaults(styles.root || {}, { position: 'absolute', zIndex: level })}
      >
        {!!props.mask && (
          <CSSTransition appear when={open} name={transitions.mask}>
            <div aria-hidden="true" className={classNames.mask} style={styles.mask}></div>
          </CSSTransition>
        )}
        <CSSTransition
          appear
          ref={states.$content}
          when={open}
          name={transitions.content}
          onEnter={(el, appearing) => {
            props.onEnter?.(el, appearing)
            actions.setIsMounted(true)
          }}
          onEntering={props.onEntering}
          onEntered={props.onEntered}
          onExit={props.onExit}
          onExiting={props.onExiting}
          onExited={(el) => {
            props.onExited?.(el)
            actions.setIsMounted(!(unmountOnExit && !keepMounted))
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

export default withDisplayName(forwardRef(Overlay))
