import { isString } from '@kpi-ui/utils'

import type { FormContextState } from '../../../_shared/context'
import type { FormItemLabelProps } from '../props'

// 格式化 FormItemLabel
export default function normalizeChildren(props: FormItemLabelProps, fallbacks: FormContextState) {
  const { required, tooltip, label } = props

  const { colon, requiredMark, layout } = fallbacks

  const hasColon = layout !== 'vertical' && colon

  let labelNode = label

  if (hasColon && isString(labelNode)) {
    // 去除用户输入的 colon
    labelNode = labelNode.replace(/[:|：]\s*$/, '')
  }
  // TODO: optional mark
  if (requiredMark === 'optional' && !required) {
    //
  }
  // TODO: tooltip
  if (tooltip) {
    //
  }

  return labelNode
}
