import { useSemanticStyles, useThrottleFrame, useThrottleTick } from '@comps/_shared/hooks'
import { attachDisplayName, cls, withDefaults } from '@comps/_shared/utils'
import { batch, noop } from '@internal/utils'
import { useMemo } from 'react'

import Overlay from '../overlay'
import ShouldUpdate from '../should-update'
import { InternalToolTipContext, type InternalToolTipContextState } from './_shared/context'
import TooltipArrow from './components/arrow'
import TooltipContent from './components/content'
import TooltipTrigger from './components/trigger'
import useTooltipEvents from './hooks/use_tooltip_events'
import useTooltipOpen from './hooks/use_tooltip_open'
import useTooltipStore from './hooks/use_tooltip_store'
import useWatchCoords from './hooks/use_watch_coords'
import { type InternalTooltipProps, defaultInternalTooltipProps } from './props'

function InternalTooltip(_props: InternalTooltipProps) {
  const props = withDefaults(_props, defaultInternalTooltipProps)

  const {
    arrow,
    children,
    className,
    classNames = {},
    content,
    fresh,
    getContainer,
    keepMounted,
    transition,
    unmountOnExit,
    // overlay
    zIndex,
  } = props

  const styles = useSemanticStyles(props)

  const [open, setOpen] = useTooltipOpen(props)

  const { actions, states } = useTooltipStore()

  const parentContext = InternalToolTipContext.useState()

  const tooltipContext = useMemo<InternalToolTipContextState>(() => {
    return batch(parentContext, (el) => {
      if (!el) return noop

      actions.appendPopupItem(el)

      return () => { actions.removePopupItem(el) }
    })
  }, [actions, parentContext])

  const [triggerEvents, popupEvents] = useTooltipEvents(props, states, setOpen)

  const onUpdate = () => { open && actions.updateCoords(props) }

  useWatchCoords(props, onUpdate)

  const handleResize = useThrottleTick(onUpdate)

  const handleScroll = useThrottleFrame(onUpdate)

  return (
    <>
      <TooltipTrigger
        ref={states.$trigger}
        events={triggerEvents}
        open={open}
        onResize={handleResize}
        onScroll={handleScroll}
      >
        {children}
      </TooltipTrigger>

      <Overlay
        style={{ left: 0, top: 0 }}
        getContainer={getContainer}
        keepMounted={keepMounted}
        mask={false}
        open={open}
        transitions={{ content: transition }}
        unmountOnExit={unmountOnExit}
        zIndex={zIndex}
      >
        <TooltipContent
          open={open}
          onMounted={tooltipContext}
          onResize={handleResize}
          onScroll={handleScroll}
        >
          <div
            ref={states.$popup}
            className={cls(className, classNames.root)}
            style={{ ...styles.root, ...states.popupCoords }}
            {...popupEvents}
          >
            <TooltipArrow
              className={classNames.arrow}
              style={{ ...styles.arrow, ...states.arrowCoords }}
              show={!!arrow}
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

attachDisplayName(InternalTooltip)

export default InternalTooltip
