import { isUndefined, logger } from '@kpi-ui/utils'
import { FormItemContext } from '../../../_shared/context'

export default function useFormItemStatus() {
  const { validateStatus } = FormItemContext.useState()

  logger(
    isUndefined(validateStatus),
    'Form.Item',
    `Form.Item.useStatus should be used under Form.Item component`
  )

  return validateStatus
}
