import reflow from '../../transition/utils/reflow'

/* eslint-disable no-param-reassign */
type E = HTMLDivElement & { _height?: number; _original?: string }

const reset = (el: E) => {
  el.style.height = el._original || ''
  delete el._height
  delete el._original
}

const inject = (el: E) => {
  el._height = el.scrollHeight
  el._original = el.style.height
}

const handlers = {
  onEnter: (el: E) => {
    inject(el)
    el.style.height = '0px'
    reflow(el)
  },
  onEntering: (el: E) => {
    el.style.height = `${el._height}px`
  },
  onEntered: reset,
  onEnterCancel: reset,
  onExit: (el: E) => {
    el.style.height = `${el.scrollHeight}px`
  },
  onExiting: (el: E) => {
    el.style.height = '0px'
  },
}

export default handlers
