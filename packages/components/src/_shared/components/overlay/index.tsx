import { cls, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { useSemanticStyles } from '_shared/hooks'
import { type ForwardedRef, type ReactElement, type RefCallback, forwardRef } from 'react'

import type { OverlayProps, OverlayRef } from './props'

import Portal from '../portal'
import { CSSTransition } from '../transition'
import ForwardFunctional from './components/forward-functional'
import useOverlayLevel from './hooks/use_overlay_level'
import useOverlayStore from './hooks/use_overlay_store'

const defaultProps: Partial<OverlayProps> = { mask: true }

function Overlay(_props: OverlayProps, ref: ForwardedRef<OverlayRef>) {
  const props = withDefaults(_props, defaultProps)

  const {
    className,
    classNames = {},
    getContainer,
    keepMounted,
    open,
    style,
    styles: _styles,
    transitions = {},
    unmountOnExit,
  } = props

  const styles = useSemanticStyles(style, _styles)

  const { actions, returnEarly, states } = useOverlayStore(props)

  const level = useOverlayLevel(states.isMounted, props)

  // TODO: lock scroll

  if (returnEarly || !states.isMounted) return null

  return (
    <Portal getContainer={getContainer} ref={ref}>
      <div
        className={cls(className, classNames.root)}
        style={withDefaults(styles.root || {}, { position: 'absolute', zIndex: level })}
      >
        {!!props.mask && (
          <CSSTransition appear name={transitions.mask} when={open}>
            <div aria-hidden="true" className={classNames.mask} style={styles.mask}></div>
          </CSSTransition>
        )}
        <CSSTransition
          appear
          name={transitions.content}
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
          ref={states.$content}
          when={open}
        >
          <ForwardFunctional<ReactElement, RefCallback<HTMLDivElement>>>
            {props.children}
          </ForwardFunctional>
        </CSSTransition>
      </div>
    </Portal>
  )
}

export default withDisplayName(forwardRef(Overlay), 'Overlay')
