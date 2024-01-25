// utils
import { withDefaults, withDisplayName } from '@kpi-ui/utils'
import cls from 'classnames'
import { useSemanticStyles } from '../../_shared/hooks'
import useOverlayStore from './hooks/use_overlay_store'
// comps
import Portal from '../portal'
import { CSSTransition } from '../transition'
// types
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
        <div
          {...attrs.wrap}
          tabIndex={-1}
          ref={store.wrap}
          className={classNames.wrap}
          style={styles.wrap}
        >
          <CSSTransition
            appear
            ref={store.content}
            when={open}
            name={transitions.content}
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
