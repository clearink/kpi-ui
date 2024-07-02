type E = HTMLDivElement

export const handlers = {
  onEnter: (el: E) => {
    el.style.width = '0px'
  },
  onEntered: (el: E) => {
    el.style.width = ''
  },
  onEntering: (el: E) => {
    el.style.width = `${el.scrollWidth}px`
  },
  onExit: (el: E) => {
    el.style.width = `${el.clientWidth}px`
  },
  onExiting: (el: E) => {
    el.style.width = '0px'
  },
}
