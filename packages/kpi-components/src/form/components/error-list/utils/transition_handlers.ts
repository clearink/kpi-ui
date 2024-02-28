import { isUndefined } from '@kpi-ui/utils'

type E = HTMLDivElement & { _height?: number }

const inject = (el: E) => {
  el._height = el.clientHeight
}

const handlers = {
  onEnter: (el: E) => {
    isUndefined(el._height) && inject(el)

    el.style.height = '0px'
  },
  onEntering: (el: E) => {
    el.style.height = `${el._height}px`
  },
  onEntered: (el: E) => {
    delete el._height
  },
  onExit: (el: E) => {
    el.style.height = `${el.clientHeight}px`
  },
  onExiting: (el: E) => {
    el.style.height = '0px'
  },
}

export default handlers
