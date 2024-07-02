import { makeFrameTimeout } from '@kpi-ui/utils'
import { useControllableState, useEvent, useWatchValue } from '_shared/hooks'
import { useEffect, useRef } from 'react'

import type { InternalTooltipProps } from '../props'

export default function useTooltipOpen(props: InternalTooltipProps) {
  const { closeDelay, content, defaultOpen, onOpenChange, open: _open, openDelay } = props

  const timer = useRef(() => {})

  useEffect(() => () => { timer.current() }, [])

  const [open, setOpen] = useControllableState({
    defaultValue: defaultOpen && !!content,
    onChange: onOpenChange,
    value: _open && !!content,
  })

  useWatchValue(content, () => { setOpen(open && !!content) })

  return [
    open,
    useEvent((action: (state: boolean) => boolean) => {
      timer.current()

      const newOpen = action(open) && !!content

      const delay = (newOpen ? openDelay : closeDelay) ?? 0

      if (delay === 0) setOpen(newOpen)
      else timer.current = makeFrameTimeout(delay, () => setOpen(newOpen))
    }),
  ] as const
}
