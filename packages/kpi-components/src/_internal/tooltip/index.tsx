// utils
import { cls, mergeRefs, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { cloneElement } from 'react'
import { useSemanticStyles } from '../../_shared/hooks'
import useTooltipResize from './hooks/use_tooltip_resize'
import useTooltipOpen from './hooks/use_tooltip_open'
import useTooltipStore from './hooks/use_tooltip_store'
// comps
import Overlay from '../overlay'
import ShouldUpdate from '../should-update'
// types
import type { InternalTooltipProps } from './props'
import useTriggerEvent from './hooks/use_trigger_event'

export const defaultProps: Partial<InternalTooltipProps> = {
  trigger: 'hover',
  openDelay: 100,
  closeDelay: 100,
  defaultOpen: false,
  placement: 'bottom',
  autoLayout: true,
  offset: 0,
}

function InternalTooltip(_props: InternalTooltipProps) {
  const props = withDefaults(_props, defaultProps)

  const {
    content,
    zIndex,
    transitions,
    fresh,
    //
    children,
    className,
    style,
    classNames = {},
    styles: _styles,
  } = props

  const styles = useSemanticStyles(style, _styles)

  const [open, setOpen] = useTooltipOpen(props)

  const { states, actions } = useTooltipStore()

  useTooltipResize(states, actions, open, props)

  const triggerHandlers = useTriggerEvent(props, setOpen)

  const contentCoords = {
    ...states.coords,
  }

  const arrowCoords = {}

  return (
    <>
      {cloneElement(children, {
        ref: mergeRefs(states.$trigger, (children as any).ref),
        ...triggerHandlers,
      })}
      <Overlay
        mask={false}
        open={open}
        zIndex={zIndex}
        transitions={transitions}
        onEnter={() => {
          console.log('onEnter')
          actions.updateCoords(props)
        }}
      >
        <div
          ref={states.$tooltip}
          className={cls(className, classNames.root)}
          style={{ ...styles.root, ...contentCoords }}
        >
          <div className={classNames.arrow} style={{ ...styles.arrow, ...arrowCoords }}></div>
          {/* 内容缓存 */}
          <ShouldUpdate when={open || !!fresh}>
            <div className={classNames.main} style={styles.main}>
              <div className={classNames.title} style={styles.title}></div>
              <div className={classNames.content} style={styles.content}>
                {content}
              </div>
            </div>
          </ShouldUpdate>
        </div>
      </Overlay>
    </>
  )
}

export default withDisplayName(InternalTooltip)
