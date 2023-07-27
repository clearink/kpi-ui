import type { AnimateElementOptions, AnimateValueOptions } from '../../../interface'

export function normalizePropertyTransition(
  maybeOptions: AnimateElementOptions | undefined,
  defaultOptions: AnimateValueOptions
) {
  return maybeOptions ?? defaultOptions
}

export const a = 1
