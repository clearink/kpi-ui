import { ConfigContext } from '../../context'

export default function usePrefixCls(name?: string) {
  const { prefixCls = 'kpi' } = ConfigContext.useState()
  return name ? `${prefixCls}-${name}` : prefixCls
}
