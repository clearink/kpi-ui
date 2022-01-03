"use strict";
// // 获取 kpiConfig
// import merge from 'lodash.merge'
// import { pathExistsSync } from 'fs-extra'
// import { GEN_CONST } from '../shared/constant'
// // 合并配置文件
// export default function mergeConfig() {
//   let config: Record<string, any> = {}
//   if (pathExistsSync(GEN_CONST.KPI_CONFIG)) {
//     // 删除缓存 有自定义配置就使用
//     delete require.cache[require.resolve(GEN_CONST.KPI_CONFIG)]
//     config = require(GEN_CONST.KPI_CONFIG)
//   }
//   delete require.cache[require.resolve('../../kpi.config.js')]
//   const defaultConfig = require('../../kpi.config.js')
//   return merge(defaultConfig, config)
// }
