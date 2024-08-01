import CheckCircleFilled from '@ink-ui/icons/esm/icons/CheckCircleFilled'
import CloseCircleFilled from '@ink-ui/icons/esm/icons/CloseCircleFilled'
import ExclamationCircleFilled from '@ink-ui/icons/esm/icons/ExclamationCircleFilled'
import InfoCircleFilled from '@ink-ui/icons/esm/icons/InfoCircleFilled'

import type { StatusType } from '../types'

export const PresetStatusIcons = {
  success: <CheckCircleFilled />,
  info: <InfoCircleFilled />,
  error: <CloseCircleFilled />,
  warning: <ExclamationCircleFilled />,
}

export function getPresetStatusIcon(type?: StatusType) {
  return type ? PresetStatusIcons[type] || null : null
}
