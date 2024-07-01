import type { ButtonProps } from '../props'

export function isBorderedVariant(variant: ButtonProps['variant']) {
  return variant !== 'link' && variant !== 'text'
}
