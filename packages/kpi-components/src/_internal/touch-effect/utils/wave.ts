import { addTimeout } from '../../transition/_shared/utils'
// types
import type { TouchEffectInfo } from '../_shared/context'

// 白色，透明 不合格
function isValidColor(color: string) {
  const matches = color.split(/[(rgba?()),\s]/g).filter(Boolean)

  if (matches.length === 3) return !['255,255,255'].includes(matches.join(','))

  if (matches.length === 4) return matches[3] !== '0'

  return false
}

function getWaveColor(node: HTMLElement) {
  const { borderTopColor, borderColor, backgroundColor } = getComputedStyle(node)

  if (isValidColor(borderTopColor)) return borderTopColor

  if (isValidColor(borderColor)) return borderColor

  if (isValidColor(backgroundColor)) return backgroundColor
}

export default function wave(info: TouchEffectInfo) {
  const { target, className } = info

  if (!target) return

  const waveColor = getWaveColor(target)

  if (!waveColor) return

  const div = document.createElement('div')

  div.style.setProperty('--wave-color', waveColor)

  div.className = className

  div.addEventListener('animationend', () => div.remove())

  addTimeout(2000, () => div.remove())

  target.insertBefore(div, target.firstChild)
}
