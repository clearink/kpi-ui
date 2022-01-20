/* 水波 */
export default class Ripple {
  /* 事件名称 父级元素 */
  public root: HTMLSpanElement | null = null
  private prefix: string = ''
  // 使用数组是因为用户在一个元素中可能触发多个 ripple
  private ripples: HTMLElement[] = []
  constructor(dom: HTMLElement, prefix = 'kpi') {
    // ripple 元素将被添加到此处
    this.prefix = prefix
    this.root = document.createElement('span')
    this.root.className = `${prefix}-ripple-root`
    dom.appendChild(this.root)
  }

  // 销毁
  destroy() {
    this.root?.parentNode?.removeChild(this.root)
  }

  // 获取 wrap 位置
  getRootRect() {
    return this.root?.getBoundingClientRect()
  }

  // 计算半径
  computeRadius(rect: DOMRect, mouse: MouseEvent) {
    const { left, top, width, height } = rect
    const { clientX: x, clientY: y } = mouse
    return [
      [left, top],
      [left, top + height],
      [left + width, top],
      [left + width, top + height],
    ].reduce((result, point) => {
      const X = Math.abs(x - point[0]) ** 2
      const Y = Math.abs(y - point[1]) ** 2
      const distance = Math.sqrt(X + Y)
      return Math.max(result, distance)
    }, 0)
  }

  // 创建 ripple 元素
  createRipple(event: MouseEvent) {
    // 获取 parent 布局信息
    const rect = this.getRootRect()

    // 计算 ripple 半径
    const radius = this.computeRadius(rect!, event)

    // 创建 ripple 元素
    this.appendRipple(rect!, event, radius)
  }

  // 添加一个 ripple
  appendRipple(rect: DOMRect, mouse: MouseEvent, radius: number) {
    const { clientX: x, clientY: y } = mouse
    const { left, top } = rect
    const div = document.createElement('div')

    // 设置样式
    div.className = `${this.prefix}-ripple`
    div.style.width = `${radius * 2}px`
    div.style.height = `${radius * 2}px`

    // 设置中心点
    div.style.left = `${x - left - radius}px`
    div.style.top = `${y - top - radius}px`
    this.root?.appendChild(div)
    this.ripples.push(div) // 保存 ripple 元素

    // 动画效果
    setTimeout(() => {
      div.style.transform = `scale3d(1, 1, 1)`
    })
  }

  // 5. 销毁 ripple 元素
  removeRipple() {
    // 销毁最先创建的ripple
    const ripple = this.ripples.shift() // 复制指向
    if (!ripple) return
    ripple.style.opacity = '0'
    // 执行动画
    const remove = (event) => {
      const { propertyName } = event
      if (propertyName !== 'opacity') return
      ripple?.parentNode?.removeChild(ripple)
      ripple?.removeEventListener('transitionend', remove)
    }
    ripple?.addEventListener('transitionend', remove)
  }
}
