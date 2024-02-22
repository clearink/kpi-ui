import { useConstant } from '@kpi-ui/hooks'

export class TooltipStore {
  $trigger = {
    current: null as Element | null,
  }

  $tooltip = {
    current: null as HTMLDivElement | null,
  }

  isFirst = true

  runFirst = () => {
    if (!this.isFirst) return

    this.isFirst = false

    // showTooltip
  }

  showTooltip = () => {}
}

export default function useTooltipStore() {
  return useConstant(() => new TooltipStore())
}
