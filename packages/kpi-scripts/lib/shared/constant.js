"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEV_CONST = exports.resolveApp = exports.CWD = void 0;
var path_1 = require("path");
var fs_extra_1 = require("fs-extra");
exports.CWD = (0, fs_extra_1.realpathSync)(process.cwd()); // 当前运行环境
function resolveApp(relativePath) {
    return (0, path_1.resolve)(exports.CWD, relativePath);
}
exports.resolveApp = resolveApp;
// dev command constant
exports.DEV_CONST = (function () {
    var constant = {
        APP_DIR: resolveApp('.'),
        SRC_DIR: resolveApp('src'),
        PUBLIC_DIR: resolveApp('public'),
        OUTPUT_PATH: resolveApp('dist'),
        RESOLVE_EXTENSIONS: ['.tsx', '.ts', '.js', '.jsx', '.mjs'],
        PUBLIC_PATH: '/',
        WEBPACK_CACHE_DIR: resolveApp('node_modules/.cache'),
        TS_CONFIG: resolveApp('tsconfig.json'),
        JS_CONFIG: resolveApp('jsconfig.json'),
        NODE_MODULES: resolveApp('node_modules'), // 待优化
    };
    return Object.assign(constant, {
        FIND_ENTRY_FILE: function () {
            var _a;
            var extension = (_a = constant.RESOLVE_EXTENSIONS.find(function (ext) {
                return (0, fs_extra_1.existsSync)((0, path_1.resolve)(constant.SRC_DIR, "index".concat(ext)));
            })) !== null && _a !== void 0 ? _a : '.js';
            return (0, path_1.resolve)(constant.SRC_DIR, "index".concat(extension));
        },
        CACHE_VERSION: require('../../package.json').version,
        PUBLIC_HTML_FILE: (0, path_1.resolve)(constant.PUBLIC_DIR, 'index.html'),
        PUBLIC_FILES: "".concat(constant.PUBLIC_DIR, "/*"),
        FIND_CACHE_TSCONFIG: function () {
            var list = [constant.TS_CONFIG, constant.JS_CONFIG];
            return list.filter(function (f) { return (0, fs_extra_1.pathExistsSync)(f); });
        },
    });
})();
