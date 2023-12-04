export default class LayoutGroupStore {
  private map = new Map<string, any>()

  active: null | string = null

  get = (id: string) => {
    return this.map.get(id)
  }

  save = <E extends HTMLElement>(
    id: string,
    previous: E | null,
    current: E | null,
    getState: (el: E) => any
  ) => {
    const state = this.map.get(id)

    this.active = id

    if (current) {
      // mount
      if (!state) this.map.set(id, getState(current))
      // 如果之前有值 不做处理
    } else {
      // unmount
      // 更新值
      if (previous) this.map.set(id, getState(previous))
    }
  }
}
