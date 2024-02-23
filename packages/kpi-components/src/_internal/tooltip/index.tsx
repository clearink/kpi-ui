// utils
import { cls, mergeRefs, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { cloneElement, useEffect, useMemo } from 'react'
import { useSemanticStyles } from '../../_shared/hooks'
import useTooltipCoords from './hooks/use_tooltip_coords'
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

  const store = useTooltipStore()

  const [open, setOpen] = useTooltipOpen(props)

  const [tooltipCoords, setTooltipCoords] = useTooltipCoords(store, props, open)

  const triggerHandlers = useTriggerEvent(props, setOpen)

  const contentCoords = {
    ...tooltipCoords,
  }

  const arrowCoords = {}

  return (
    <>
      {cloneElement(children, {
        ref: mergeRefs(store.$trigger, (children as any).ref),
        ...triggerHandlers,
      })}
      <Overlay
        mask={false}
        open={open}
        zIndex={zIndex}
        transitions={transitions}
        onEnter={() => {
          const newCoords = store.updateCoords(open, props, tooltipCoords)

          newCoords && setTooltipCoords(newCoords)
        }}
      >
        <div
          ref={store.$tooltip}
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
