"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 获取 kpiConfig
var lodash_merge_1 = __importDefault(require("lodash.merge"));
var fs_extra_1 = require("fs-extra");
var constant_1 = require("../shared/constant");
// 合并配置文件
function mergeConfig() {
    var config = {};
    if ((0, fs_extra_1.pathExistsSync)(constant_1.GEN_CONST.KPI_CONFIG)) {
        // 删除缓存 有自定义配置就使用
        delete require.cache[require.resolve(constant_1.GEN_CONST.KPI_CONFIG)];
        config = require(constant_1.GEN_CONST.KPI_CONFIG);
    }
    delete require.cache[require.resolve('../../kpi.config.js')];
    var defaultConfig = require('../../kpi.config.js');
    return (0, lodash_merge_1.default)(defaultConfig, config);
}
exports.default = mergeConfig;
