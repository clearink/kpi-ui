type E = HTMLDivElement

const handlers = {
  onEnter: (el: E) => {
    el.style.height = '0px'
  },
  onEntering: (el: E) => {
    el.style.height = `${el.scrollHeight}px`
  },
  onEntered: (el: E) => {
    el.style.height = ''
  },
  onExit: (el: E) => {
    el.style.height = `${el.clientHeight}px`
  },
  onExiting: (el: E) => {
    el.style.height = '0px'
  },
}

export default handlers
