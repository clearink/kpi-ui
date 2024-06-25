import { batch, cls, noop, removeItem, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { useSemanticStyles, useThrottleFrame, useThrottleTick } from '_hooks'
import { useMemo } from 'react'
import { InternalToolTipContext, type InternalToolTipContextState } from './_shared/context'
import useTooltipEvents from './hooks/use_tooltip_events'
import useTooltipOpen from './hooks/use_tooltip_open'
import useTooltipStore from './hooks/use_tooltip_store'
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
  closeDelay: 200,
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
    transition,
    arrow,
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

  const parentContext = InternalToolTipContext.useState()

  const tooltipContext = useMemo<InternalToolTipContextState>(() => {
    return batch(parentContext, (el) => {
      if (!el) return noop

      states.popups.push(el)

      // prettier-ignore
      return () => { removeItem(states.popups, el) }
    })
  }, [parentContext, states.popups])

  const [triggerEvents, popupEvents] = useTooltipEvents(props, states, setOpen)

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
        <TooltipContent
          open={open}
          onResize={handleResize}
          onScroll={handleScroll}
          onMounted={tooltipContext}
        >
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
            <InternalToolTipContext.Provider value={tooltipContext}>
              <ShouldUpdate when={open || !!fresh}>{content}</ShouldUpdate>
            </InternalToolTipContext.Provider>
          </div>
        </TooltipContent>
      </Overlay>
    </>
  )
}

export default withDisplayName(InternalTooltip)
