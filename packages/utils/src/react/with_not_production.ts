// types
import type { AnyFn } from '@kpi-ui/types'

import { noop } from '../function'

const isProd = process.env.NODE_ENV === 'production'

// prettier-ignore
export const withNotProd = isProd ? noop : (callback: AnyFn) => { callback() }
