import { useControllableState, useEvent, useWatchValue } from '_shared/hooks'
import { makeFrameTimeout } from '@kpi-ui/utils'
import { useEffect, useRef } from 'react'

import type { InternalTooltipProps } from '../props'

export default function useTooltipOpen(props: InternalTooltipProps) {
  const { open: _open, content, openDelay, closeDelay, defaultOpen, onOpenChange } = props

  const timer = useRef(() => {})

  // prettier-ignore
  useEffect(() => () => { timer.current() }, [])

  const [open, setOpen] = useControllableState({
    value: _open && !!content,
    defaultValue: defaultOpen && !!content,
    onChange: onOpenChange,
  })

  // prettier-ignore
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
