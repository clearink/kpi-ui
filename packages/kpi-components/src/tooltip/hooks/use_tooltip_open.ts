import { useControllableState, useEvent } from '@kpi-ui/hooks'
import { fallback, makeFrameTimeout } from '@kpi-ui/utils'
import { useEffect, useRef, type SetStateAction } from 'react'
import { defaultProps } from '..'
// types
import type { TooltipProps } from '../props'

export default function useTooltipOpen(props: TooltipProps) {
  const { open: _open, defaultOpen, onOpenChange } = props

  const cleanupTimer = useRef(() => {})

  // prettier-ignore
  useEffect(() => () => { cleanupTimer.current() }, [])

  const [open, setOpen] = useControllableState({
    value: _open,
    defaultValue: fallback(defaultOpen, defaultProps.defaultOpen),
    onChange: onOpenChange,
  })

  return [
    open,
    useEvent((state: SetStateAction<boolean>, delay = 0) => {
      cleanupTimer.current()

      if (delay === 0) setOpen(state)
      else cleanupTimer.current = makeFrameTimeout(delay, () => setOpen(state))
    }),
  ] as const
}
