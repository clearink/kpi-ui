import { useConstant } from '@kpi-ui/hooks'

export class ModalStore {
  wrap = {
    current: null as HTMLDivElement | null,
    show: () => {
      const el = this.wrap.current
      el && el.style.removeProperty('display')
    },
    hide: () => {
      const el = this.wrap.current
      el && el.style.setProperty('display', 'none', 'important')
    },
  }
}

export default function useModalStore() {
  return useConstant(() => new ModalStore())
}
