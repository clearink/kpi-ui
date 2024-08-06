import type { AnyFn } from '@internal/types'

import { caf, execute, nextTick, noop, raf } from '@internal/utils'

import makeSchedulerHook from './utils/make_hook'

type HookFn = <F extends AnyFn>(callback: F) => F

export const useThrottleTick: HookFn = makeSchedulerHook({
  initialValue: noop,
  onCleanup: execute,
  onScheduler: nextTick,
  shouldPrevent: fn => fn !== noop,
})

export const useDebounceTick: HookFn = makeSchedulerHook({
  initialValue: noop,
  onCleanup: execute,
  onScheduler: nextTick,
  shouldPrevent: fn => ((fn(), false)),
})

export const useThrottleFrame: HookFn = makeSchedulerHook({
  initialValue: -1,
  onCleanup: caf,
  onScheduler: raf,
  shouldPrevent: id => id !== -1,
})

export const useDebounceFrame: HookFn = makeSchedulerHook({
  initialValue: -1,
  onCleanup: caf,
  onScheduler: raf,
  shouldPrevent: id => ((caf(id), false)),
})
