import { cls } from '@kpi-ui/utils'

import type { ModalProps } from '../props'

export default function useFormatClass(prefixCls: string, props: ModalProps) {
  const { className, classNames = {} } = props

  return {
    body: cls(`${prefixCls}__body`, classNames.body),
    close: cls(`${prefixCls}__close`, classNames.close),
    footer: cls(`${prefixCls}__footer`, classNames.footer),
    header: cls(`${prefixCls}__header`, classNames.header),
    main: cls(`${prefixCls}__main`, classNames.main),
    root: cls(prefixCls, className, classNames.root),
  }
}
