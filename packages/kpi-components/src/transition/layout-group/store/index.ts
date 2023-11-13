export default class LayoutTransitionStore {
  map = new Map<string, DOMRect>()

  // 注册
  register = (coords: DOMRect, id: string) => {
    this.map.set(id, coords)
    // console.log('register', instance.getBoundingClientRect())
  }

  coords(id: string) {
    return this.map.get(id)
  }
}
