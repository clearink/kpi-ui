import { isUndefined, logger } from '@kpi/shared'
import { FormItemContext } from '../../_internal/context'

export default function useFormItemStatus() {
  const { validateStatus } = FormItemContext.useState()

  logger(
    isUndefined(validateStatus),
    'Form.Item',
    `Form.Item.useStatus should be used under Form.Item component`
  )

  return validateStatus
}
