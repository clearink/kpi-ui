"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 获取 kpiConfig
var merge_1 = __importDefault(require("lodash/merge"));
var utils_1 = require("../shared/utils");
var fs_extra_1 = require("fs-extra");
var constant_1 = require("../shared/constant");
function getKpiConfig() {
    var config = {};
    if ((0, fs_extra_1.pathExistsSync)(constant_1.KPI_CONFIG)) {
        // 删除缓存 有自定义配置就使用
        delete require.cache[require.resolve(constant_1.KPI_CONFIG)];
        config = require(constant_1.KPI_CONFIG);
    }
    delete require.cache[require.resolve('../../kpi.default.config.js')];
    var defaultConfig = require('../../kpi.default.config.js');
    var mergedConfig = (0, merge_1.default)(defaultConfig, config);
    // output
    var source = JSON.stringify(mergedConfig, null, 2);
    (0, utils_1.outputFileOnChangeSync)(constant_1.SITE_CONFIG, source);
    return mergedConfig;
}
exports.default = getKpiConfig;
