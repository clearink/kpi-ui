/* 波纹 */
export default class Wave {
  private container: HTMLElement | null = null

  private node: HTMLElement | null = null

  constructor(node: HTMLElement) {
    this.node = node
    this.container = document.createElement('span')
    this.container.className = 'kpi-wave'
    node.appendChild(this.container)
  }

  // 如果 waveColor 是 白色，透明直接 return
  static isValidColor(color: string) {
    const matches = color.split(/[(rgba?()),\s]/g).filter(Boolean)
    if (matches.length === 3) {
      return !['255,255,255'].includes(matches.join(','))
    }
    if (matches.length === 4) {
      return matches[3] !== '0'
    }
    return false
  }

  private getWaveColor() {
    const computed = getComputedStyle(this.node!)
    return (
      computed.getPropertyValue('border-top-color') || // Firefox Compatible
      computed.getPropertyValue('border-color') ||
      computed.getPropertyValue('background-color')
    )
  }

  // 销毁
  destroy() {
    this.container?.parentNode?.removeChild(this.container)
    // 清除引用
    this.container = null
    this.node = null
  }

  createWave() {
    const { container } = this
    if (!container) return

    const waveColor = this.getWaveColor()
    if (!Wave.isValidColor(waveColor)) return

    this.container?.style.setProperty('--wave-color', waveColor)
    const wave = document.createElement('span')
    wave.className = `kpi-wave__item`
    wave.addEventListener('animationend', () => {
      this.container?.removeChild(wave)
    })
    this.container?.appendChild(wave)
  }
}
