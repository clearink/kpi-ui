import type { AnimateElementOptions, AnimateValueOptions } from '../../../interface'

export function normalizePropertyTransition(
  maybeOptions: AnimateElementOptions | undefined,
  defaultOptions: AnimateValueOptions | undefined
) {
  return { ...defaultOptions, ...maybeOptions }
}

export const a = 1
