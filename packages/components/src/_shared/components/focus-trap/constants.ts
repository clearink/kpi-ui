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
  height: 0,
  left: -1,
  overflow: 'hidden',
  padding: 0,
  position: 'fixed',
  top: -1,
  width: 1,
}
