type E = HTMLDivElement & { _height?: number; _original?: string }

const reset = (el: E) => {
  el.style.height = el._original || ''
  delete el._height
  delete el._original
}

const inject = (el: E) => {
  el._height = el.clientHeight
  el._original = el.style.height
}

const handlers = {
  onEnter: (el: E, appearing: boolean) => {
    appearing && inject(el)
    el.style.height = '0px'
  },
  onEntering: (el: E) => {
    el.style.height = `${el._height}px`
  },
  onEntered: reset,
  onEnterCancel: (el: E, appearing: boolean) => {
    el.style.height = `${el.clientHeight}px`
  },
  onExit: (el: E) => {
    el.style.height = `${el.clientHeight}px`
  },
  onExiting: (el: E) => {
    el.style.height = '0px'
  },
}

export default handlers
