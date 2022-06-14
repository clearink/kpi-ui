let supported: boolean | undefined = undefined
export default function detectFlexGap() {
  if (!document.documentElement && !document.body) return false

  if (supported !== undefined) return supported

  const flexContainer = document.createElement('div')
  flexContainer.style.display = 'flex'
  flexContainer.style.flexDirection = 'column'
  flexContainer.style.rowGap = '1px'

  flexContainer.appendChild(document.createElement('div'))
  flexContainer.appendChild(document.createElement('div'))
  
  document.body.appendChild(flexContainer)
  supported = flexContainer.scrollHeight === 1
  document.body.removeChild(flexContainer)

  return supported
}
