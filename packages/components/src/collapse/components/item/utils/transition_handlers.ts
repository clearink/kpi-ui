type E = HTMLDivElement

function reset(el: E) {
  el.style.height = ''
}

function full(el: E) {
  el.style.height = `${el.scrollHeight}px`
}

function none(el: E) {
  el.style.height = '0px'
}

const handlers = {
  onEnter: none,
  onEnterCancel: full,
  onEntered: reset,
  onEntering: full,
  onExit: full,
  onExitCancel: full,
  onExited: reset,
  onExiting: none,
}

export default handlers
