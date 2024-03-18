import { caf, nextTick, noop, raf } from '@kpi-ui/utils'
import makeSchedulerHook from './utils/make'
import { AnyFn } from '@kpi-ui/types'

type HookFn = <F extends AnyFn>(callback: F) => F

export const useThrottleTick: HookFn = makeSchedulerHook({
  initialValue: noop,
  onCleanup: (fn) => fn(),
  shouldReturn: (fn) => fn !== noop,
  onScheduler: nextTick,
})

export const useDebounceTick: HookFn = makeSchedulerHook({
  initialValue: noop,
  onCleanup: (fn) => fn(),
  onScheduler: nextTick,
  shouldReturn: (fn) => (fn(), false),
})

export const useThrottleFrame: HookFn = makeSchedulerHook({
  initialValue: -1,
  onCleanup: caf,
  onScheduler: raf,
  shouldReturn: (id) => id > -1,
})

export const useDebounceFrame: HookFn = makeSchedulerHook({
  initialValue: -1,
  onCleanup: caf,
  onScheduler: raf,
  shouldReturn: (id) => (caf(id), false),
})
