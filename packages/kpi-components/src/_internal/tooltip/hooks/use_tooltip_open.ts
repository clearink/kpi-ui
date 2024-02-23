import { useControllableState, useEvent, useUnmountEffect } from '@kpi-ui/hooks'
import { fallback } from '@kpi-ui/utils'
import { useRef, type SetStateAction } from 'react'
import { defaultProps } from '..'
// types
import type { InternalTooltipProps } from '../props'

export default function useTooltipOpen(props: InternalTooltipProps) {
  const { open: _open, defaultOpen, onOpenChange } = props

  const timer = useRef<any>(undefined)

  useUnmountEffect(() => clearTimeout(timer.current))

  const [open, setOpen] = useControllableState({
    value: _open,
    defaultValue: fallback(defaultOpen, defaultProps.defaultOpen),
    onChange: onOpenChange,
  })

  return [
    open,
    useEvent((state: SetStateAction<boolean>, delay = 0) => {
      clearTimeout(timer.current)

      if (delay === 0) setOpen(state)
      else timer.current = setTimeout(() => setOpen(state), delay)
    }),
  ] as const
}
