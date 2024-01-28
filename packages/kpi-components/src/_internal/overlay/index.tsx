// utils
import { cls, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { useSemanticStyles } from '../../_shared/hooks'
import useOverlayStore from './hooks/use_overlay_store'
// comps
import Portal from '../portal'
import { CSSTransition } from '../transition'
import ForwardFunctional from './components/forward_functional'
// types
import type { ReactElement, RefCallback } from 'react'
import type { OverlayProps } from './props'

export const defaultProps: Partial<OverlayProps> = { mask: true }

function Overlay(_props: OverlayProps) {
  const props = withDefaults(_props, defaultProps)

  const {
    open,
    keepMounted,
    unmountOnExit,
    mask,
    className,
    attrs = {},
    transitions = {},
    classNames = {},
    onBeforeOpen,
    onAfterClose,
  } = props

  const store = useOverlayStore(props)

  const styles = useSemanticStyles(props.style, props.styles)

  if (!open && !store.isMounted) return null

  return (
    <Portal getContainer={props.getContainer}>
      <div {...attrs.root} className={cls(className, classNames.root)} style={styles.root}>
        {!!mask && (
          <CSSTransition appear when={open} name={transitions.mask} mountOnEnter={!keepMounted}>
            <div
              {...attrs.mask}
              aria-hidden="true"
              className={classNames.mask}
              style={styles.mask}
            ></div>
          </CSSTransition>
        )}

        <CSSTransition
          appear
          ref={store.content}
          when={open}
          name={transitions.content}
          mountOnEnter={!keepMounted}
          onEnter={() => {
            onBeforeOpen && onBeforeOpen()
            store.setIsMounted(true)
          }}
          onExited={() => {
            onAfterClose && onAfterClose()
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

/**
 * @internal 仅提供给 modal与drawer组件使用
 *  */
export default withDisplayName(Overlay)
