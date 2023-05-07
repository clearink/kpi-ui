import { noop } from '@kpi/shared'
import { easings } from '../../tween'

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
  easing: easings.linear,
  delay: 0,
  autoplay: true,
  ...LifeCycles,
}
