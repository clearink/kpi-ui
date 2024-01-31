// utils
import { cls, fallback, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { useSemanticStyles, useZIndex } from '../../_shared/hooks'
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
    transitions = {},
    classNames = {},
    onBeforeOpen,
    onAfterClose,
  } = props

  const store = useOverlayStore(props)

  const styles = useSemanticStyles(props.style, props.styles)

  const zIndex = useZIndex()

  console.log('zIndex', zIndex)

  if (!open && !store.isMounted) return null

  return (
    <Portal getContainer={props.getContainer}>
      <div
        className={cls(className, classNames.root)}
        style={withDefaults(styles.root || {}, { zIndex })}
      >
        {!!mask && (
          <CSSTransition appear when={open} name={transitions.mask} mountOnEnter={!keepMounted}>
            <div aria-hidden="true" className={classNames.mask} style={styles.mask}></div>
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

export default withDisplayName(Overlay)
