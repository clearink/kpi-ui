import { useThrottleFrame, useThrottleTick } from '@kpi-ui/hooks'
import { cls, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { useSemanticStyles } from '../../_shared/hooks'
import { ToolTipContext } from './_shared/context'
import useTooltipOpen from './hooks/use_tooltip_open'
import useTooltipStore from './hooks/use_tooltip_store'
import useTriggerEvent from './hooks/use_trigger_event'
import useWatchCoords from './hooks/use_watch_coords'
// comps
import Overlay from '../overlay'
import ShouldUpdate from '../should-update'
import TooltipArrow from './components/arrow'
import TooltipContent from './components/content'
import TooltipTrigger from './components/trigger'
// types
import type { InternalTooltipProps } from './props'

const defaultProps: Partial<InternalTooltipProps> = {
  trigger: 'hover',
  openDelay: 100,
  closeDelay: 100,
  defaultOpen: false,
  placement: 'top',
  shift: true,
  flip: true,
  offset: 0,
  arrow: true,
}

function InternalTooltip(_props: InternalTooltipProps) {
  const props = withDefaults(_props, defaultProps)

  const {
    // overlay
    zIndex,
    keepMounted,
    unmountOnExit,
    getContainer,
    //
    arrow,
    //
    transition,
    fresh,
    content,
    children,
    className,
    classNames = {},
    style,
    styles: _styles,
  } = props

  const styles = useSemanticStyles(style, _styles)

  const [open, setOpen] = useTooltipOpen(props)

  const { states, actions } = useTooltipStore()

  const [triggerEvents, popupEvents] = useTriggerEvent(states, props, setOpen)

  // prettier-ignore
  const onUpdate = () => { open && actions.updateCoords(props) }

  useWatchCoords(props, onUpdate)

  const handleResize = useThrottleTick(onUpdate)

  const handleScroll = useThrottleFrame(onUpdate)

  return (
    <>
      <TooltipTrigger
        ref={states.$trigger}
        open={open}
        onResize={handleResize}
        onScroll={handleScroll}
        events={triggerEvents}
      >
        {children}
      </TooltipTrigger>

      <Overlay
        style={{ left: 0, top: 0 }}
        mask={false}
        open={open}
        zIndex={zIndex}
        keepMounted={keepMounted}
        unmountOnExit={unmountOnExit}
        getContainer={getContainer}
        transitions={{ content: transition }}
      >
        <TooltipContent open={open} onResize={handleResize} onScroll={handleScroll}>
          <div
            ref={states.$popup}
            className={cls(className, classNames.root)}
            style={{ ...styles.root, ...states.popupCoords }}
            {...popupEvents}
          >
            <TooltipArrow
              show={!!arrow}
              className={classNames.arrow}
              style={{ ...styles.arrow, ...states.arrowCoords }}
            />
            {/* <ToolTipContext.Provider value={{}}> */}
            <ShouldUpdate when={open || !!fresh}>{content}</ShouldUpdate>
            {/* </ToolTipContext.Provider> */}
          </div>
        </TooltipContent>
      </Overlay>
    </>
  )
}

export default withDisplayName(InternalTooltip)
