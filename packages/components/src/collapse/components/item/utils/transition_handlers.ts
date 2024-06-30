type E = HTMLDivElement

const reset = (el: E) => {
  el.style.height = ''
}

const full = (el: E) => {
  el.style.height = `${el.scrollHeight}px`
}

const none = (el: E) => {
  el.style.height = '0px'
}

const handlers = {
  onEnter: none,
  onEntering: full,
  onEntered: reset,
  onEnterCancel: full,
  onExit: full,
  onExiting: none,
  onExited: reset,
  onExitCancel: full,
}

export default handlers
