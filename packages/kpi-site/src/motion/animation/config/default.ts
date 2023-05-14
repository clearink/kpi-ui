import { noop } from '@kpi/shared'
import { eases } from '../../easing'

export const LifeCycles = {
  onStart: noop,
  onChange: noop,
  onPause: noop,
  onRepeat: noop,
  onCancel: noop,
  onStop: noop,
  onComplete: noop,
}

export const Options = {
  duration: 300,
  easing: eases.linear,
  delay: 0,
  autoplay: true,
  times: [],
  ...LifeCycles,
}
