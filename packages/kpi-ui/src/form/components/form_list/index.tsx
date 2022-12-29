import { memo } from 'react'
import { List as InternalFormList } from '../../../_internal/components/form'
import { logger } from '../../../_internal/utils'

import type { FormListProps } from '../../props'

function FormList(props: FormListProps) {
  const { children, name } = props

  logger.error(!name, 'Form.List', 'Miss `name` prop.')

  return (
    <InternalFormList {...props}>
      {(fields, arrayHelpers, meta) => {
        return children(fields, arrayHelpers, {
          errors: meta.errors,
          warnings: meta.warnings,
        })
      }}
    </InternalFormList>
  )
}

export default memo(FormList)
