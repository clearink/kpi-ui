import { useControllableState, useEvent, useWatchValue } from '@kpi-ui/hooks'
import { makeFrameTimeout } from '@kpi-ui/utils'
import { useEffect, useRef } from 'react'
// types
import type { InternalTooltipProps } from '../props'

export default function useTooltipOpen(props: InternalTooltipProps) {
  const { open: _open, content, defaultOpen, onOpenChange } = props

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
    useEvent((state: boolean, delay = 0) => {
      timer.current()

      if (delay === 0) setOpen(state && !!content)
      else timer.current = makeFrameTimeout(delay, () => setOpen(state && !!content))
    }),
  ] as const
}
