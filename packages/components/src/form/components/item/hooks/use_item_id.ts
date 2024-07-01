import { isNullish, toArray } from '@kpi-ui/utils'
import { useMemo } from 'react'

import type { FormItemProps } from '../props'

// 唯一id
export default function useItemId(name: FormItemProps['name'], formName?: string) {
  return useMemo(() => {
    if (isNullish(name)) return undefined

    const id = toArray(name).join('_')

    return isNullish(formName) ? id : `${formName}_${id}`
  }, [formName, name])
}
