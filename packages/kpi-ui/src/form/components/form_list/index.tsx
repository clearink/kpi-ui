import { List as InternalFormList } from '@kpi/internal/lib/form'
import { logger } from '@kpi/shared'

import type { FormListProps } from '../../props'

function FormList(props: FormListProps) {
  const { children, name } = props

  logger(!name, 'Form.List', 'Miss `name` prop.')

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

export default FormList
