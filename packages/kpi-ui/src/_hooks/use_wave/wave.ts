/* 波纹 */
export default class Wave {
  private container: HTMLSpanElement | null = null

  constructor(private prefix: string, private node: HTMLElement) {
    this.container = document.createElement('span')
    this.container.className = prefix
    node.appendChild(this.container)
  }

  private setWaveColor() {
    const computed = getComputedStyle(this.node)
    const color =
      computed.getPropertyValue('border-top-color') || // Firefox Compatible
      computed.getPropertyValue('border-color') ||
      computed.getPropertyValue('background-color')
    this.container?.style.setProperty('--wave-color', color)
  }

  // 销毁
  destroy() {
    this.container?.parentNode?.removeChild(this.container)
  }

  createWave() {
    const { container } = this
    if (!container) return
    this.setWaveColor()

    const wave = document.createElement('span')
    wave.className = `${this.prefix}__item`
    wave.addEventListener('animationend', () => {
      this.container?.removeChild(wave)
    })
    this.container?.appendChild(wave)
  }
}
