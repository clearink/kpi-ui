// utils
import { cls, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { useSemanticStyles } from '../../_shared/hooks'
import useTooltipOpen from './hooks/use_tooltip_open'
import useTooltipStore from './hooks/use_tooltip_store'
import useTooltipUpdate from './hooks/use_tooltip_update'
import useTriggerEvent from './hooks/use_trigger_event'
// comps
import Overlay from '../overlay'
import ShouldUpdate from '../should-update'
import TooltipContent from './components/content'
import TooltipTrigger from './components/trigger'
// types
import type { InternalTooltipProps } from './props'

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
    zIndex,
    transitions,
    fresh,
    //
    content,
    children,
    className,
    style,
    classNames = {},
    styles: _styles,
  } = props

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

      <Overlay mask={false} open={open} zIndex={zIndex} transitions={transitions}>
        <TooltipContent open={open} onUpdate={handleUpdateCoords}>
          <div
            ref={states.$tooltip}
            className={cls(className, classNames.root)}
            style={{ ...styles.root, ...states.tooltipCoords }}
          >
            <div
              ref={states.$arrow}
              className={classNames.arrow}
              style={{ ...styles.arrow, ...states.arrowCoords }}
            ></div>
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

export default withDisplayName(InternalTooltip)
