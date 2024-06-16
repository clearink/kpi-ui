type E = HTMLDivElement

export const handlers = {
  onEnter: (el: E) => {
    el.style.width = '0px'
  },
  onEntering: (el: E) => {
    el.style.width = `${el.scrollWidth}px`
  },
  onEntered: (el: E) => {
    el.style.width = ''
  },
  onExit: (el: E) => {
    el.style.width = `${el.clientWidth}px`
  },
  onExiting: (el: E) => {
    el.style.width = '0px'
  },
}
