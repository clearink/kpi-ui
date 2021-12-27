// 获取 kpiConfig
import merge from 'lodash/merge'
import { outputFileOnChangeSync } from '../shared/utils'
import { pathExistsSync } from 'fs-extra'
import { KPI_CONFIG, SITE_CONFIG } from '../shared/constant'
export default function getKpiConfig() {
  let config: Record<string, any> = {}
  if (pathExistsSync(KPI_CONFIG)) {
    // 删除缓存 有自定义配置就使用
    delete require.cache[require.resolve(KPI_CONFIG)]
    config = require(KPI_CONFIG)
  }

  delete require.cache[require.resolve('../../kpi.default.config.js')]
  const defaultConfig = require('../../kpi.default.config.js')
  const mergedConfig = merge(defaultConfig, config)
  // output
  const source = JSON.stringify(mergedConfig, null, 2)
  outputFileOnChangeSync(SITE_CONFIG, source)
  return mergedConfig
}
