import { noop } from '../function'
// types
import type { AnyFn } from '@kpi-ui/types'

const isProd = process.env.NODE_ENV === 'production'

// prettier-ignore
export const withNotProd = isProd ? noop : (callback: AnyFn) => { callback() }
