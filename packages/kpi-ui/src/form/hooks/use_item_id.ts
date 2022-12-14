import { useMemo } from 'react'
import { FormContext } from '../../_internal/context'
import { isUndefined, toArray } from '../../_internal/utils'

import type { FormItemProps } from '../props'

export default function useFormItemId(name: FormItemProps['name']) {
  const { formName } = FormContext.useState()

  return useMemo(() => {
    const namePath = toArray(name)
    if (!namePath.length) return undefined

    const id = namePath.join('_')
    if (isUndefined(formName)) return id

    return `${formName}_${id}`
  }, [formName, name])
}
