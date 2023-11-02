import { Form as InternalForm } from '@kpi-ui/internal'
import { logger } from '@kpi-ui/utils'

import type { FormListProps } from '../../props'

function FormList(props: FormListProps) {
  const { children, name } = props

  logger(!name, 'Form.List', 'Miss `name` prop.')

  return (
    <InternalForm.List {...props}>
      {(fields, arrayHelpers, meta) => {
        return children(fields, arrayHelpers, {
          errors: meta.errors,
          warnings: meta.warnings,
        })
      }}
    </InternalForm.List>
  )
}

export default FormList
