/* eslint-disable no-param-reassign */
type E = HTMLDivElement & { _height: string }
const handlers = {
  // onEnter: (el: E) => {
  //   el._height = `${el.scrollHeight}px`
  //   el.style.height = '0px'
  // },
  // onEntering: (el: E) => {
  //   el.style.height = `${el._height}px`
  // },
  // onEntered: (el: E) => {
  //   el.style.height = ''
  // },
  // onEnterCancel: (el: E) => {
  //   el.style.height = ''
  // },
  onExit: (el: E) => {
    el.style.height = `${el.scrollHeight}px`
  },
  onExiting: (el: E) => {
    el.style.height = '0px'
  },
  onExitCancel: (el: E) => {
    el.style.height = `${el.scrollHeight}px`
  },
  onExited: (el: E) => {
    el.style.height = ''
  },
}

export default handlers
