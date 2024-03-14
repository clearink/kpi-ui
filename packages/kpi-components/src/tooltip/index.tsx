// utils
import { cls, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { usePrefixCls, useSemanticStyles } from '../_shared/hooks'
import useTooltipOpen from './hooks/use_tooltip_open'
import useTooltipStore from './hooks/use_tooltip_store'
import useTooltipUpdate from './hooks/use_tooltip_update'
import useTriggerEvent from './hooks/use_trigger_event'
import useFormatClass from './hooks/use_format_class'
// comps
import Overlay from '../_internal/overlay'
import ShouldUpdate from '../_internal/should-update'
import TooltipContent from './components/content'
import TooltipTrigger from './components/trigger'
// types
import type { TooltipProps } from './props'

export const defaultProps: Partial<TooltipProps> = {
  trigger: 'hover',
  openDelay: 100,
  closeDelay: 100,
  defaultOpen: false,
  placement: 'top',
  autoLayout: true,
  offset: 0,
  arrow: true,
}

function Tooltip(_props: TooltipProps) {
  const props = withDefaults(_props, defaultProps)

  const {
    // overlay
    zIndex,
    keepMounted,
    unmountOnExit,
    //
    arrow,
    //
    fresh,
    content,
    children,
    className,
    style,
    styles: _styles,
  } = props

  const rootPrefixCls = usePrefixCls()

  const prefixCls = `${rootPrefixCls}-tooltip`

  const classNames = useFormatClass(prefixCls, props)

  const styles = useSemanticStyles(style, _styles)

  const [open, setOpen] = useTooltipOpen(props)

  const { states, actions } = useTooltipStore(props)

  const handleUpdateCoords = useTooltipUpdate(actions, props, open)

  const triggerHandlers = useTriggerEvent(props, setOpen)

  return (
    <>
      <TooltipTrigger
        ref={states.$trigger}
        open={open}
        onUpdate={handleUpdateCoords}
        events={triggerHandlers}
      >
        {children}
      </TooltipTrigger>

      <Overlay
        mask={false}
        open={open}
        zIndex={zIndex}
        transitions={{
          content: `${rootPrefixCls}-zoom-fast`,
        }}
        keepMounted={keepMounted}
        unmountOnExit={unmountOnExit}
      >
        <TooltipContent open={open} onUpdate={handleUpdateCoords}>
          <div
            ref={states.$popup}
            className={cls(className, classNames.root)}
            style={{ ...styles.root, ...states.tooltipCoords }}
          >
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: 'blue',
                position: 'absolute',
                left: 'calc(var(--origin-x, 50%) - 2px)',
                top: 'calc(var(--origin-y, 50%) - 2px)',
                zIndex: 20,
              }}
            ></div>
            {!!arrow && (
              <div
                ref={states.$arrow}
                className={classNames.arrow}
                style={{ ...styles.arrow, ...states.arrowCoords }}
              />
            )}
            {/* 内容缓存 */}
            <ShouldUpdate when={open || !!fresh}>
              <div className={classNames.content} style={styles.content} role="tooltip">
                {content}
              </div>
            </ShouldUpdate>
          </div>
        </TooltipContent>
      </Overlay>
    </>
  )
}

export default withDisplayName(Tooltip)
