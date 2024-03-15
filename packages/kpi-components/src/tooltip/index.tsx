// utils
import { useWatchValue } from '@kpi-ui/hooks'
import { cls, fallback, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { usePrefixCls, useSemanticStyles } from '../_shared/hooks'
import useFormatClass from './hooks/use_format_class'
import useTooltipOpen from './hooks/use_tooltip_open'
import useTooltipStore from './hooks/use_tooltip_store'
import useTriggerEvent from './hooks/use_trigger_event'
import useUpdateCoords from './hooks/use_update_coords'
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
    placement,
    //
    transition,
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

  const triggerHandlers = useTriggerEvent(props, setOpen)

  const handleUpdateCoords = useUpdateCoords(actions, props, open)

  // prettier-ignore
  useWatchValue(placement, () => { actions.updateCoords(props) })

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
        keepMounted={keepMounted}
        unmountOnExit={unmountOnExit}
        transitions={{ content: fallback(transition, `${rootPrefixCls}-zoom-fast`) }}
      >
        <TooltipContent open={open} onUpdate={handleUpdateCoords}>
          <div
            ref={states.$popup}
            className={cls(className, classNames.root)}
            style={{ ...styles.root, ...states.tooltipCoords }}
          >
            <div
              style={{
                border: '1px solid blue',
                borderRadius: '50%',
                position: 'absolute',
                left: 'var(--origin-x, 50%)',
                top: 'var(--origin-y, 50%)',
                zIndex: 20,
              }}
            ></div>
            {!!arrow && (
              <div
                className={classNames.arrow}
                style={{ ...styles.arrow, ...states.arrowCoords }}
              />
            )}
            {/* 内容缓存 TODO: content 能否使用 render props */}
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
