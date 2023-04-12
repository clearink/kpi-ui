export interface MotionValueEventCallbacks<V = any> {
  start?: VoidFunction
  change?: (current: V) => void
  pause?: VoidFunction
  cancel?: VoidFunction
  stop?: VoidFunction
  finish?: VoidFunction
}
export type MotionValueEventName<V = any> = keyof MotionValueEventCallbacks<V>
export type MotionValueEventHandler<N extends MotionValueEventName> = MotionValueEventCallbacks[N]
