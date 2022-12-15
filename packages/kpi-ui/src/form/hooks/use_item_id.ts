import { useMemo } from 'react'
import { isUndefined, toArray } from '../../_internal/utils'

import type { FormItemProps } from '../props'

// 唯一id
export default function useFormItemId(name: FormItemProps['name'], formName?: string) {
  return useMemo(() => {
    const namePath = toArray(name)
    if (!namePath.length) return undefined

    const id = namePath.join('_')
    if (isUndefined(formName)) return id

    return `${formName}_${id}`
  }, [formName, name])
}
