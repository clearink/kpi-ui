"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GEN_CONST = exports.CWD = exports.resolveApp = void 0;
var path_1 = require("path");
var fs_extra_1 = require("fs-extra");
function resolveApp(relativePath) {
    return (0, path_1.resolve)(exports.CWD, relativePath);
}
exports.resolveApp = resolveApp;
exports.CWD = (0, fs_extra_1.realpathSync)(process.cwd()); // 当前运行环境
// gen command constant
exports.GEN_CONST = (function () {
    var constant = {
        SRC_DIR: resolveApp('src'),
        KPI_CONFIG: resolveApp('kpi.config.js'),
        TEST_DIR_NAME: '__tests__',
        DOCS_DIR_NAME: 'docs',
        COMPONENT_FILE_NAME: '{name}.tsx',
        INDEX_FILE_NAME: 'index.tsx',
        STYLE_FILE_NAME: 'style.scss',
        PROPS_FILE_NAME: function (extension) { return "props".concat(extension ? '.ts' : ''); },
    };
    return constant;
})();
