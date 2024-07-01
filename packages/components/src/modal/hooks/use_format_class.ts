import { cls } from '@kpi-ui/utils'

import type { ModalProps } from '../props'

export default function useFormatClass(prefixCls: string, props: ModalProps) {
  const { className, classNames = {} } = props

  return {
    root: cls(prefixCls, className, classNames.root),
    main: cls(`${prefixCls}__main`, classNames.main),
    close: cls(`${prefixCls}__close`, classNames.close),
    header: cls(`${prefixCls}__header`, classNames.header),
    body: cls(`${prefixCls}__body`, classNames.body),
    footer: cls(`${prefixCls}__footer`, classNames.footer),
  }
}
