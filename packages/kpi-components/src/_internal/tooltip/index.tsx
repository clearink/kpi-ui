// utils
import { useControllableState } from '@kpi-ui/hooks'
import { cls, fallback, mergeRefs, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { cloneElement, useEffect, useRef } from 'react'
import { useSemanticStyles } from '../../_shared/hooks'
import useTooltipAlign from './hooks/use_tooltip_align'
import useTooltipStore from './hooks/use_tooltip_store'
// comps
import Overlay from '../overlay'
import ShouldUpdate from '../should-update'
// types
import type { InternalTooltipProps } from './props'
import useTriggerObserver from './hooks/use_trigger_observer'

const defaultProps: Partial<InternalTooltipProps> = {
  trigger: 'hover',
  openDelay: 100,
  closeDelay: 200,
}

function InternalTooltip(_props: InternalTooltipProps) {
  const props = withDefaults(_props, defaultProps)

  const {
    open: _open,
    defaultOpen,
    children,
    content,
    zIndex,
    transitions,
    fresh,
    className,
    style,
    classNames = {},
    styles: _styles,
    onOpenChange,
  } = props

  const store = useTooltipStore()

  const styles = useSemanticStyles(style, _styles)

  const [open, setOpen] = useControllableState({
    value: _open,
    defaultValue: fallback(defaultOpen, false),
    onChange: onOpenChange,
  })

  useTriggerObserver(store, open)

  const [tooltipCoords, setTooltipCoords] = useTooltipAlign(store.$trigger, open)

  const onMouseEnter: React.MouseEventHandler<HTMLElement> = () => {
    setOpen(true)
  }
  const onMouseLeave: React.MouseEventHandler<HTMLElement> = () => {
    console.log('leave')
    setOpen(false)
  }

  useEffect(() => {
    const tooltip = store.$tooltip.current

    if (!tooltip || !open) return
    // 当 tooltip 改变时 尝试 对齐 tooltip
    console.log('effect')
  }, [store, open, tooltipCoords])

  return (
    <>
      {cloneElement(children, {
        ref: mergeRefs(store.$trigger, (children as any).ref),
        onMouseEnter,
        onMouseLeave,
      })}
      <Overlay
        mask={false}
        open={open}
        zIndex={zIndex}
        transitions={transitions}
        onEnter={store.attemptRunFirst}
      >
        <div
          ref={store.$tooltip}
          className={cls(className, classNames.root)}
          style={{ ...styles.root }}
        >
          <div className={classNames.arrow} style={styles.arrow}></div>
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

/**
 * @zh 内部组件
 */
export default withDisplayName(InternalTooltip)
