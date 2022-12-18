import { FormItemContext } from '../../_internal/context'
import { isUndefined, logger } from '../../_internal/utils'

export default function useFormItemStatus() {
  const { validateStatus } = FormItemContext.useState()

  logger.error(
    isUndefined(validateStatus),
    'Form.Item',
    `Form.Item.useStatus should be used under Form.Item component`
  )

  return validateStatus
}
