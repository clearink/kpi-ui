import { getClientCoords, getElementStyle, makeFrameTimeout, observe } from '@kpi-ui/utils'
import { getPositionedElement } from '_shared/utils'
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
  const { borderTopColor, borderColor, backgroundColor } = getElementStyle(node)

  if (isValidColor(borderTopColor)) return borderTopColor

  if (isValidColor(borderColor)) return borderColor

  if (isValidColor(backgroundColor)) return backgroundColor
}

export default function showWaveEffect(info: TouchEffectInfo) {
  const { target, prefixCls } = info

  if (!target) return

  const waveColor = getWaveColor(target)

  if (!waveColor) return

  const div = document.createElement('div')

  div.style.setProperty('--wave-color', waveColor)

  div.className = `${prefixCls}-wave`

  const resize = () => {
    const targetCoords = getClientCoords(target)

    const divCoords = getClientCoords(getPositionedElement(div))

    div.style.height = `${targetCoords.height}px`

    div.style.width = `${targetCoords.width}px`

    const dx = targetCoords.left - divCoords.left

    const dy = targetCoords.top - divCoords.top

    div.style.transform = `translate3d(${dx}px, ${dy}px, 0)`
  }

  const disconnect = observe(target, resize)

  // prettier-ignore
  const destroy = () => { disconnect(); div.remove() }

  div.addEventListener('animationstart', resize)

  div.addEventListener('animationend', destroy)

  makeFrameTimeout(2000, destroy)

  target.insertBefore(div, target.firstChild)
}
