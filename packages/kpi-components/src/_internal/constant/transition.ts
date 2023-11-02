export const UNMOUNTED = 'unmounted'
export const EXITED = 'exited'
export const ENTERING = 'entering'
export const ENTERED = 'entered'
export const EXITING = 'exiting'
export const ENTER = 'enter'
export const EXIT = 'exit'

export type TransitionStatus =
  | typeof ENTERING
  | typeof ENTERED
  | typeof EXITING
  | typeof EXITED
  | typeof UNMOUNTED
  | typeof ENTER
  | typeof EXIT
