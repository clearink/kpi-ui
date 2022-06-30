/* 波纹 */
export default class Wave {
  private wave: HTMLSpanElement | null = null;

  constructor(dom: HTMLElement) {
    this.wave = document.createElement('span');
    this.wave.className = 'kpi-wave';
    this.wave.addEventListener('animationend', () => {
      this.wave?.classList.remove('kpi-wave--active');
    });
    dom.appendChild(this.wave);
  }

  // 销毁
  destroy() {
    this.wave?.parentNode?.removeChild(this.wave);
  }

  createWave() {
    const { wave } = this;
    if (!wave) return;
    wave.classList.remove('kpi-wave--active');
    setTimeout(() => {
      wave.classList.add('kpi-wave--active');
    });
  }
}
