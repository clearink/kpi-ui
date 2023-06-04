export interface MotionEventCallbacks<V = any> {
  start?: VoidFunction
  update?: (current: V) => void
  pause?: VoidFunction
  cancel?: VoidFunction
  stop?: VoidFunction
  complete?: VoidFunction
}
export type MotionValueEventName<V = any> = keyof MotionEventCallbacks<V>
export type MotionValueEventHandler<V, N extends MotionValueEventName> = MotionEventCallbacks<V>[N]
