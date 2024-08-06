import { execute, noop } from '@internal/utils'

const isProd = process.env.NODE_ENV === 'production'

export const withNotProd = isProd ? noop : execute
