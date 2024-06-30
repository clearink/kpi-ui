export const TabbableQuery = [
  'input',
  'select',
  'textarea',
  'a[href]',
  'button',
  '[tabindex]:not(slot)',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  'details>summary:first-of-type',
  'details',
].join(',')

export const guardStyles: React.CSSProperties = {
  position: 'fixed',
  width: 1,
  height: 0,
  padding: 0,
  overflow: 'hidden',
  top: -1,
  left: -1,
}
