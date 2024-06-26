import { ConfigContext } from '_shared/contexts'

export function usePrefixCls(name?: string) {
  const { prefixCls = 'kpi' } = ConfigContext.useState()
  return name ? `${prefixCls}-${name}` : prefixCls
}
