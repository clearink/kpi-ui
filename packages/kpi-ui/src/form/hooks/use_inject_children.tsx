import { useCallback } from 'react'
import { Field as InternalFormField } from '../../_internal/components/form'
import { normalizeItemChildren } from '../utils/children'

import type { FormInstance, FormItemProps } from '../props'
import type { FieldMeta } from '../../_internal/components/form/internal_props'

// 向 Form.Item 包裹的组件内部 注入数据
export default function useInjectChildren(
  props: FormItemProps,
  formInstance: FormInstance,
  formItemId?: string
) {
  const children = normalizeItemChildren(props, formInstance, formItemId)

  // if (isValidElement(children)) {
  //   // TODO: 检测是否支持 ref 获取 dom 用于实现 scrollToField
  // }

  const handleMetaChange = useCallback((meta: FieldMeta) => {
    // console.log('meta change', meta)
  }, [])

  return (
    <InternalFormField {...props} onMetaChange={handleMetaChange}>
      {children}
    </InternalFormField>
  )
}
