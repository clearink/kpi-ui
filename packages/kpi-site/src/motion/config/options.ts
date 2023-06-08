import { eases } from '../easing'

import type { AnimateValueOptions } from '../animation/interface'

const Options = {
  easing: eases.linear,
  times: [],

  delay: 0,
  duration: 300,
  autoplay: true,

  repeat: 0,
  repeatType: 'loop',
  repeatDelay: 0,
}

export default Options as AnimateValueOptions
