/* eslint-disable no-plusplus */

import { isNullish } from '@kpi/shared'

const cache: Record<string, number> = {}

export default function uniqueId(prefix = '') {
  const str = isNullish(prefix) ? '' : String(prefix)

  if (!cache[str]) cache[str] = 0

  return `${str}${cache[str]++}`
}
