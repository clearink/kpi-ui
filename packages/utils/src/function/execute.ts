import type { VoidFn } from '@internal/types'

export function execute(fn: VoidFn) {
  fn()
}
