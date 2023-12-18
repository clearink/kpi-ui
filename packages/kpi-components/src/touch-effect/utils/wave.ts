export default function Wave(container: HTMLElement | null) {
  if (!container) return

  const holder = document.createElement('div')

  holder.style.cssText = 'position: absolute; top: 0; left: 0'

  container.insertBefore(holder, container.firstChild)

  container.style.setProperty('--wave-color', 'red')

  const wave = document.createElement('span')

  wave.className = 'kpi-wave__item'

  wave.addEventListener('animationend', () => {
    container.removeChild(holder)
  })

  holder.appendChild(wave)
}
