import { useControllableState } from '@kpi-ui/hooks'
import { fallback } from '@kpi-ui/utils'
// types
import { InternalTooltipProps } from '../props'

export default function useTooltipOpen(props: InternalTooltipProps) {
  const { open, defaultOpen, onOpenChange } = props

  return useControllableState({
    value: open,
    defaultValue: fallback(defaultOpen, false),
    onChange: onOpenChange,
  })
}
