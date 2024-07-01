import { useConstant } from '_shared/hooks'

import coords from '../utils/coords'

// 共享即将卸载的元素布局属性
// TODO: 自定义属性
export default function useSharedLayout<E extends HTMLElement = HTMLElement>() {
  const state = useConstant(() => ({
    instance: null as E | null,
    rect: null as DOMRect | null,
    refCallback: (el: E | null) => {
      if (!el && state.instance) state.rect = coords(state.instance)
      state.instance = el
    },
  }))

  return state
}
