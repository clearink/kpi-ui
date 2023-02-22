import { isUndefined } from '@kpi/shared'

let supported: boolean | undefined

window?.addEventListener?.('DOMContentLoaded', detectFlexGap)

export default function detectFlexGap() {
  if (!isUndefined(supported)) return supported

  if (!document) return false

  if (!document.documentElement && !document.body) return false

  const flexContainer = document.createElement('div')

  flexContainer.appendChild(document.createElement('div'))
  flexContainer.appendChild(document.createElement('div'))

  flexContainer.style.cssText =
    'display: flex; flex-direction: column; row-gap: 1px; position: absolute;'

  document.body.appendChild(flexContainer)
  supported = flexContainer.scrollHeight === 1
  document.body.removeChild(flexContainer)

  return supported
}
