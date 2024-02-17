import { useConstant } from '@kpi-ui/hooks'

export class TooltipStore {
  trigger = {
    current: null as Element | null,
  }

  tooltip = {
    current: null as HTMLDivElement | null,
  }
}

export default function useTooltipStore() {
  return useConstant(() => new TooltipStore())
}
