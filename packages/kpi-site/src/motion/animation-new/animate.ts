import { isFunction, noop, pick } from '@kpi/shared'
import { motionAnimation } from './animation'
import playbackControl from './playback_control'
import { motionValue } from './motion'

import type { MotionValue } from './motion'
import type { ElementOrSelector } from '../utils/resolve_element'
import type { MotionValueEventName } from './motion/motion_event'
import type { AnimationOptions } from './playback_control'

export function animate(
  elementOrSelector: ElementOrSelector,
  keyframes: any,
  options: AnimationOptions
) {
  // animate elements
  // animate value
}

// animate value or motionValue
export function animateValue<V extends string | number>(
  from: V | MotionValue<V>,
  to: V,
  options?: AnimationOptions
) {
  const value = motionValue(from)

  console.log(value)

  // create animation
  const animations = motionAnimation(value.get(), to)

  // create playback control
  const control = playbackControl(value, animations, options)

  if (options?.autoplay) control.play()

  return control
}

const eventNames: `on${Capitalize<MotionValueEventName>}`[] = [
  'onStart',
  'onChange',
  'onPause',
  'onCancel',
  'onStop',
  'onFinish',
]

function subscribeMotionEvent(value: MotionValue, options: AnimationOptions = {}) {
  // const picked = pick(options, eventNames)
  // return Object.entries(picked).map(([eventName, handler]) => {
  //   if (!isFunction(handler)) return noop
  //   return value.on(eventName as MotionValueEventName, handler)
  // })
}

// const a = motionValue(0)

// const unsubscribe = a.on('start', () => {
//   console.log('animation start')
// })

// animateValue(a, 200, {
//   duration: 300,
//   ease: 'easeInBack',
// })

// // animate dom
// animate('#some-id',{
//   translateX: 200,
// })

// animate(ref.current!,{
//   translateX: 200,
// })

// // animate single value
// animate(0, 100)
// animate('#fff', '#000')
