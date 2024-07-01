import { isNumber,isUndefined } from '@kpi-ui/utils'
import { useMemo } from 'react'

import type { ColProps } from '../props'

const COL_FLEX_REG = /^\d+(\.\d+)?(px|r?em|%)$/

export default function useFormatFlex(flex: ColProps['flex']) {
  return useMemo(() => {
    if (isUndefined(flex)) return flex
    if (isNumber(flex)) return `${flex} ${flex} auto`
    if (COL_FLEX_REG.test(flex)) return `0 0 ${flex}`
  }, [flex])
}
