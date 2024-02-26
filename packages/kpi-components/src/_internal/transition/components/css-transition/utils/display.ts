export function showElement(el: HTMLElement | null, display: string | undefined) {
  el && el.style.setProperty('display', display || '')
}

export function hideElement(el: HTMLElement | null) {
  el && el.style.setProperty('display', 'none')
}
